#!/usr/bin/env python3
"""Check saved presentation structure and offline shell without a browser."""

import argparse
import base64
import gzip
import hashlib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

sys.dont_write_bytecode = True

from schema_checks import ValidationError, validate_project


class DeckParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.ids = set()
        self.actions = set()
        self.scripts = {}
        self.styles = []
        self.external = []
        self.current_script = None
        self.current_style = False

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if "data-act" in attrs:
            self.actions.add(attrs["data-act"])
        if tag == "script":
            self.current_script = attrs.get("id", "anonymous")
            self.scripts[self.current_script] = ""
        if tag == "style":
            self.current_style = True
            self.styles.append("")
        asset = attrs.get("src") if tag in {"script", "img", "iframe", "video", "audio", "source"} else attrs.get("href") if tag == "link" else None
        if asset and not asset.startswith(("data:", "#")):
            self.external.append(asset)

    def handle_endtag(self, tag):
        if tag == "script":
            self.current_script = None
        if tag == "style":
            self.current_style = False

    def handle_data(self, data):
        if self.current_script is not None:
            self.scripts[self.current_script] += data
        elif self.current_style:
            self.styles[-1] += data


WARN_BYTES = 12 * 1024 * 1024
MAX_BYTES = 20 * 1024 * 1024
LARGE_IMAGE_BYTES = 600 * 1024


SVG_TEXT = re.compile(r"<(text|tspan)\b[^>]*>([^<]*\S[^<]*)</\1>", re.I)


def example_strings(kit_path):
    """Visible strings of the style's example deck: text, image alt and SVG labels."""
    kit = json.loads(kit_path.read_text(encoding="utf-8"))
    found = set()

    def walk(node):
        for value in (node.get("text"), node.get("alt"), *[match.group(2) for match in SVG_TEXT.finditer(node.get("svg") or "")]):
            if isinstance(value, str) and len(value.strip()) >= 4 and re.search(r"[^\W\d_]", value):
                found.add(value.strip())
        for child in node.get("children", []):
            walk(child)

    for recipe in kit.get("recipes", []):
        walk(recipe["root"])
    return found


def leftover_example(project, samples):
    hits = []

    def walk(node, slide):
        for kind, value in (("text", node.get("text")), ("alt", node.get("alt")), *[("svgText", match.group(2)) for match in SVG_TEXT.finditer(node.get("svg") or "")]):
            if isinstance(value, str) and value.strip() in samples:
                hits.append(f"{slide}/{node['id']} {kind}: {value.strip()[:80]}")
        for child in node.get("children", []):
            walk(child, slide)

    for slide in project["slides"]:
        walk(slide["root"], slide["id"])
    return hits


def check_html(filename, expected_slides=None, max_bytes=MAX_BYTES, style_kit=None):
    html = filename.read_text(encoding="utf-8")
    size = len(html.encode("utf-8"))
    if size > max_bytes:
        raise ValidationError(f"Deck is {size / 1048576:.1f} MB; the limit is {max_bytes / 1048576:.0f} MB. Run scripts/optimize-images.py")
    parser = DeckParser()
    parser.feed(html)
    required_ids = {"deck-data", "editor-config", "locale-data", "pptx-runtime", "app-runtime", "canvas", "slide-list", "floating", "tool-tooltip", "color-popover", "notes-panel", "present-nav", "export-menu"}
    missing = required_ids - parser.ids
    if missing:
        raise ValidationError("Missing editor elements: " + ", ".join(sorted(missing)))
    required_actions = {"present", "export-html", "export-pptx", "print", "undo", "redo", "add-slide"}
    if not required_actions.issubset(parser.actions):
        raise ValidationError("Missing editor actions: " + ", ".join(sorted(required_actions - parser.actions)))
    if parser.external:
        raise ValidationError("External runtime asset: " + parser.external[0])
    css = "\n".join(parser.styles)
    if re.search(r"@import\b|url\(\s*[\"']?(?:https?:|//)", css):
        raise ValidationError("External stylesheet or CSS asset")
    for placeholder in ["__EDITOR_CSS__", "__EDITOR_RUNTIME__", "__I18N_RUNTIME__", "__PRESENTATION_FORMAT__", "__PERSISTENCE_RUNTIME__", "__PPTX_RUNTIME__"]:
        if placeholder in css or placeholder in parser.scripts["app-runtime"] or placeholder in parser.scripts["pptx-runtime"]:
            raise ValidationError("Unresolved runtime placeholder: " + placeholder)
    project = json.loads(parser.scripts["deck-data"])
    config = json.loads(parser.scripts["editor-config"])
    report = validate_project(project, config)
    if expected_slides is not None and report["slides"] != expected_slides:
        raise ValidationError(f"Expected {expected_slides} slides, found {report['slides']}")
    catalogs = json.loads(parser.scripts["locale-data"])
    expected_locales = {"en", "zh", "zh-tw", "ja", "ko", "es", "pt-br", "de", "fr", "ar", "ru", "it", "hi", "id", "tr", "vi", "th", "nl", "pl", "he"}
    if set(catalogs) != expected_locales:
        raise ValidationError("The shared editor must include all 20 UI locales")
    base = catalogs["en"]
    for locale, values in catalogs.items():
        if set(values) != set(base):
            raise ValidationError("Locale key mismatch: " + locale)
        for key, value in values.items():
            if not isinstance(value, str) or not value or sorted(re.findall(r"\{\w+\}", value)) != sorted(re.findall(r"\{\w+\}", base[key])):
                raise ValidationError("Locale value or placeholder mismatch: " + locale + " / " + key)
    runtime = parser.scripts["pptx-runtime"].strip()
    if "PptxGenJS" not in runtime:
        try:
            runtime = gzip.decompress(base64.b64decode(runtime, validate=True)).decode("utf-8")
        except (ValueError, OSError):
            raise ValidationError("Bundled PPTX export runtime cannot be unpacked")
        if "PptxGenJS" not in runtime:
            raise ValidationError("Bundled PPTX export runtime is incomplete")
    if "window.editableDeck" not in parser.scripts["app-runtime"]:
        raise ValidationError("Shared native export API is absent")
    if "@media print" not in css or not re.search(r"(?:1280|720)", css):
        raise ValidationError("Fixed paper or print pagination styles are absent")
    images = []
    vector_sources = []

    def walk(node):
        if node["type"] == "image":
            if node.get("src"):
                images.append(hashlib.sha256(node["src"].encode("utf-8")).hexdigest())
            if node.get("svg"):
                vector_sources.append(hashlib.sha256(node["svg"].encode("utf-8")).hexdigest())
        for child in node.get("children", []):
            walk(child)

    for slide in project["slides"]:
        walk(slide["root"])
    warnings = []
    if size > WARN_BYTES:
        warnings.append(f"Deck is {size / 1048576:.1f} MB; keep it under {WARN_BYTES / 1048576:.0f} MB with scripts/optimize-images.py")
    large = sorted((len(url) * 3 // 4 for url in re.findall(r"data:image/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+", parser.scripts["deck-data"])), reverse=True)
    large = [item for item in large if item > LARGE_IMAGE_BYTES]
    if large:
        warnings.append(f"{len(large)} embedded image(s) exceed {LARGE_IMAGE_BYTES // 1024} KB (largest {large[0] // 1024} KB)")
    leftover = leftover_example(project, example_strings(style_kit)) if style_kit else []
    if leftover:
        warnings.append(f"{len(leftover)} string(s) still match the style's example deck; replace them or confirm they are generic labels: " + "; ".join(leftover[:12]))
    return {"ok": True, "warnings": warnings, "leftoverExample": leftover, **report, "locales": len(catalogs), "messagesPerLocale": len(base), "imageDataUrlHashes": images, "svgSourceHashes": vector_sources, "bytes": size, "checks": "static structure and offline shell; browser and native-application acceptance remain separate"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html", type=Path)
    parser.add_argument("--expected-slides", type=int)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--style-kit", type=Path, help="references/style-kit.json: warn about example text, alt and SVG labels left in the deck")
    parser.add_argument("--max-mb", type=float, default=MAX_BYTES / 1048576, help="Fail above this size (default 20)")
    args = parser.parse_args()
    if args.expected_slides is not None and args.expected_slides < 1:
        parser.error("--expected-slides must be a positive integer")
    report = check_html(args.html, args.expected_slides, int(args.max_mb * 1048576), args.style_kit)
    text = json.dumps(report, indent=2)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(text + "\n", encoding="utf-8")
    print(text)


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, ValidationError) as error:
        print("Check failed: " + str(error), file=sys.stderr)
        sys.exit(1)
