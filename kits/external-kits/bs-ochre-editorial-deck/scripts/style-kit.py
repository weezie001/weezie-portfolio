#!/usr/bin/env python3
"""Extract a reusable style kit from an example deck, or compose a new project from it.

The example deck and every deck a user generates share one stylesheet and one set of
slide recipes, so what the store shows is what the Skill produces.

  extract: demo.html | project.json  ->  style-kit.json
  compose: style-kit.json + plan.json  ->  project.json (then edit freely and build)
"""

import argparse
import base64
import copy
import hashlib
import html
import json
import mimetypes
import re
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True

PLACEHOLDER = "data:image/svg+xml;base64," + base64.b64encode(
    b'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">'
    b'<rect width="1600" height="900" fill="#e5e5e5"/><path d="M0 900 600 420l320 300 220-180 460 360Z" fill="#d4d4d4"/>'
    b'<circle cx="1180" cy="260" r="90" fill="#d4d4d4"/></svg>'
).decode("ascii")
SLIDE_FIELDS = ("classNames", "attributes", "style", "imported", "palette", "typography", "background", "locale", "direction", "growToFit")
RASTER = re.compile(r"^data:image/(?:png|jpeg|webp|gif)[;,]", re.I)
TAG = re.compile(r"(<[^>]+>)")
SVG_TEXT = re.compile(r"(<(text|tspan)\b[^>]*>)([^<]*\S[^<]*)(</\2>)", re.I)
PAGE_COUNTER = re.compile(r"^(\s*)(\d{1,3})(\s*(?:/|of)\s*)(\d{1,3})(\s*)$", re.I)
ORDINAL = re.compile(r"^\s*0?\d\s*$")


def raster_size(src):
    """Pixel size of a PNG, JPEG, WebP or GIF data URL, read from its header."""
    try:
        data = base64.b64decode(src.split(",", 1)[1][:200000] + "==")
    except (ValueError, IndexError):
        return None
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", data[16:24])
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return struct.unpack("<HH", data[6:10])
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        kind = data[12:16]
        if kind == b"VP8X":
            return 1 + int.from_bytes(data[24:27], "little"), 1 + int.from_bytes(data[27:30], "little")
        if kind == b"VP8 ":
            width, height = struct.unpack("<HH", data[26:30])
            return width & 0x3FFF, height & 0x3FFF
        if kind == b"VP8L":
            bits = int.from_bytes(data[21:25], "little")
            return 1 + (bits & 0x3FFF), 1 + ((bits >> 14) & 0x3FFF)
    if data[:2] == b"\xff\xd8":
        index = 2
        while index + 9 < len(data):
            if data[index] != 0xFF:
                index += 1
                continue
            marker, length = data[index + 1], struct.unpack(">H", data[index + 2:index + 4])[0]
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                height, width = struct.unpack(">HH", data[index + 5:index + 9])
                return width, height
            index += 2 + length
    return None


def aspect_label(size):
    width, height = size
    ratio = width / height
    for label, value in (("1:1", 1), ("5:4", 1.25), ("4:3", 4 / 3), ("3:2", 1.5), ("16:9", 16 / 9), ("2:1", 2), ("21:9", 21 / 9), ("4:5", 0.8), ("3:4", 3 / 4), ("2:3", 2 / 3), ("1:2", 0.5), ("9:16", 9 / 16)):
        if abs(ratio - value) / value < 0.04:
            return label
    return f"{width}:{height}"


def structured(markup):
    """Rich text whose styled parts (spans, small, strong...) must survive a copy change."""
    return bool(markup) and bool(re.search(r"<(?!br\b|/?br\b)[a-z]", markup, re.I))


def segments(markup):
    return [html.unescape(part) for part in TAG.split(markup) if part and not TAG.fullmatch(part) and part.strip()]


def fill_segments(markup, values):
    """Replace text runs in order, keeping every tag and attribute."""
    values = [str(v) for v in values]
    parts, index = TAG.split(markup), 0
    for i, part in enumerate(parts):
        if part and not TAG.fullmatch(part) and part.strip():
            if index >= len(values):
                raise ValueError(f"needs {len(segments(markup))} segments, got {len(values)}")
            lead, trail = part[:len(part) - len(part.lstrip())], part[len(part.rstrip()):]
            parts[i] = lead + html.escape(values[index], quote=False).replace("\n", "<br>") + trail
            index += 1
    if index != len(values):
        raise ValueError(f"needs {index} segments, got {len(values)}")
    return "".join(parts)


def svg_texts(svg):
    return [html.unescape(match.group(3)) for match in SVG_TEXT.finditer(svg or "")]


def fill_svg_texts(svg, values):
    values, index = [str(v) for v in values], 0

    def swap(match):
        nonlocal index
        if index >= len(values):
            raise ValueError(f"needs {len(svg_texts(svg))} SVG text runs, got {len(values)}")
        index += 1
        return match.group(1) + html.escape(values[index - 1], quote=False) + match.group(4)

    result = SVG_TEXT.sub(swap, svg)
    if index != len(values):
        raise ValueError(f"needs {index} SVG text runs, got {len(values)}")
    return result


def percent_styles(node):
    """Inline percentages usually encode data (bar length, progress, chart share)."""
    css = (node.get("style") or {}).get("css") or {}
    return {key: value for key, value in css.items() if isinstance(value, str) and value.strip().endswith("%")}


def guess_locale(plan):
    """Default the content language from the plan's own text when it does not name one."""
    chunks = []

    def collect(value):
        if isinstance(value, str):
            chunks.append(value)
        elif isinstance(value, list):
            for item in value:
                collect(item)
        elif isinstance(value, dict):
            for item in value.values():
                collect(item)

    for entry in plan.get("slides", []):
        collect(entry.get("text", {}))
    collect(plan.get("title", ""))
    text = "".join(chunks)
    letters = [ch for ch in text if ch.isalpha()]
    if not letters:
        return None
    if sum("\u3040" <= ch <= "\u30ff" for ch in letters) > 5:
        return "ja"
    if sum("\uac00" <= ch <= "\ud7af" for ch in letters) / len(letters) > 0.3:
        return "ko"
    if sum("\u4e00" <= ch <= "\u9fff" for ch in letters) / len(letters) > 0.3:
        return "zh-CN"
    return None


def plain(markup):
    return html.unescape(re.sub(r"<[^>]+>", "", re.sub(r"<br\s*/?>", "\n", markup, flags=re.I)))


def read_project(path):
    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() in {".html", ".htm"}:
        match = re.search(r'<script id="deck-data" type="application/json">(.*?)</script>', text, re.S)
        if not match:
            raise ValueError("No embedded project found in " + str(path))
        return json.loads(match.group(1))
    payload = json.loads(text)
    return payload["project"] if isinstance(payload, dict) and "project" in payload else payload


def walk(node, visit):
    visit(node)
    for child in node.get("children", []):
        walk(child, visit)


def extract(source, keep_images_under):
    project = read_project(source)
    recipes, placeholders = [], 0
    for slide in project["slides"]:
        root = copy.deepcopy(slide["root"])
        images = []

        def scrub(node):
            nonlocal placeholders
            src = node.get("src")
            if node.get("type") == "image" and isinstance(src, str) and RASTER.match(src) and len(src) > keep_images_under:
                entry = {"node": node["id"], "alt": node.get("alt", ""), "height": node.get("height"), "fit": node.get("fit")}
                size = raster_size(src)
                if size:
                    # Generate pictures at this shape; the slide frame was designed around it.
                    entry.update(size=f"{size[0]}x{size[1]}", aspect=aspect_label(size))
                images.append(entry)
                node["src"] = PLACEHOLDER
                placeholders += 1

        walk(root, scrub)
        texts = []
        def note(node):
            if not (isinstance(node.get("text"), str) and node["text"].strip()):
                return
            entry = {"node": node["id"], "type": node["type"], "sample": node["text"][:160]}
            if structured(node.get("html")):
                entry["segments"] = segments(node["html"])
            texts.append(entry)

        walk(root, note)
        vectors, styles = [], []

        def inspect(node):
            runs = svg_texts(node.get("svg"))
            if node.get("svg"):
                vectors.append({"node": node["id"], **({"svgText": runs} if runs else {})})
            if percent_styles(node):
                styles.append({"node": node["id"], "css": percent_styles(node)})

        walk(root, inspect)
        recipe = {"recipe": slide["id"], "title": slide.get("title", ""), "slide": {key: slide[key] for key in SLIDE_FIELDS if key in slide}, "root": root, "texts": texts, "images": images}
        if vectors:
            recipe["vectors"] = vectors
        if styles:
            recipe["styles"] = styles
        recipes.append(recipe)
    kit = {
        "schemaVersion": 1,
        "kind": "editable-deck-style-kit",
        "source": {"projectId": project.get("id"), "sha256": hashlib.sha256(json.dumps(project, sort_keys=True).encode("utf-8")).hexdigest()},
        "palette": project.get("palette"),
        "typography": project.get("typography", {}),
        "contentLocale": project.get("contentLocale"),
        "contentDirection": project.get("contentDirection"),
        "imported": bool(project.get("imported")),
        "contentCSS": project.get("contentCSS", ""),
        "recipes": recipes,
    }
    for key in ("x-source", "x-fontAliases"):
        if key in project:
            kit[key] = project[key]
    return kit, {"recipes": len(recipes), "imagePlaceholders": placeholders}


def image_value(value, base):
    # library:<id> pictures are inlined later by scripts/embed-library-images.mjs.
    if isinstance(value, str) and (value.startswith("data:image/") or re.fullmatch(r"library:[\w.-]+", value)):
        return value
    path = (base / value).resolve()
    mime = mimetypes.guess_type(path.name)[0]
    if mime not in {"image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"}:
        raise ValueError("Unsupported image file: " + str(value))
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def compose(kit, plan, base):
    recipes = {recipe["recipe"]: recipe for recipe in kit["recipes"]}
    project = {
        "schemaVersion": 1,
        "version": 1,
        "id": plan.get("id") or "deck-" + hashlib.sha256(json.dumps(plan, sort_keys=True).encode("utf-8")).hexdigest()[:12],
        "title": plan.get("title", ""),
        "palette": plan.get("palette") or kit["palette"],
        "contentLocale": plan.get("contentLocale") or guess_locale(plan) or kit.get("contentLocale") or "en",
        "contentDirection": plan.get("contentDirection") or kit.get("contentDirection") or "auto",
        "contentCSS": kit.get("contentCSS", ""),
        "slides": [],
    }
    if kit.get("typography"):
        project["typography"] = plan.get("typography") or kit["typography"]
    if kit.get("imported"):
        project["imported"] = True
    for key in ("x-source", "x-fontAliases"):
        if key in kit:
            project[key] = kit[key]
    used, remaining_placeholders, structure_lost, leftover, renumbered = set(), [], [], [], []
    total = len(plan["slides"])
    kit_total = len(kit["recipes"])
    recipe_index = {recipe["recipe"]: number for number, recipe in enumerate(kit["recipes"], 1)}
    for index, entry in enumerate(plan["slides"], 1):
        recipe = recipes.get(entry.get("recipe"))
        if not recipe:
            raise ValueError(f"Slide {index}: unknown recipe {entry.get('recipe')!r}")
        slide_id = entry.get("id") or f"{recipe['recipe']}-{index}"
        if slide_id in used or re.search(r'["<>\s]', slide_id):
            raise ValueError("Duplicate or invalid slide id: " + slide_id)
        used.add(slide_id)
        root = copy.deepcopy(recipe["root"])
        frames = {image["node"]: image for image in recipe.get("images", [])}
        removed = set(entry.get("remove", []))
        texts, images = entry.get("text", {}), entry.get("images", {})
        alts, vectors, vector_texts, styles = entry.get("alt", {}), entry.get("svg", {}), entry.get("svgText", {}), entry.get("style", {})
        known = set()
        walk(root, lambda node: known.add(node["id"]))
        unknown = (set(texts) | set(images) | set(alts) | set(vectors) | set(vector_texts) | set(styles) | removed) - known
        if root["id"] in removed:
            raise ValueError(f"Slide {slide_id}: the slide root cannot be removed")

        def prune(node):
            if "children" in node:
                node["children"] = [child for child in node["children"] if child["id"] not in removed]
                for child in node["children"]:
                    prune(child)

        prune(root)
        if unknown:
            raise ValueError(f"Slide {slide_id}: unknown recipe node(s) {sorted(unknown)}")

        def apply(node):
            original = node["id"]
            if original in texts:
                value = texts[original]
                if isinstance(value, list):
                    if not structured(node.get("html")):
                        raise ValueError(f"Slide {slide_id}: {original} has no styled segments; pass a string")
                    try:
                        node["html"] = fill_segments(node["html"], value)
                    except ValueError as error:
                        raise ValueError(f"Slide {slide_id}: {original} {error}")
                    node["text"] = plain(node["html"])
                elif isinstance(value, dict):
                    node["text"] = value.get("text", "")
                    if "html" in value:
                        node["html"] = value["html"]
                    else:
                        node.pop("html", None)
                else:
                    if structured(node.get("html")):
                        structure_lost.append(f"{slide_id}/{original}")
                    node["text"] = str(value)
                    # Imported nodes do not preserve raw newlines; their line breaks live in rich text.
                    if "\n" in node["text"] and (node.get("imported") or "html" in node):
                        node["html"] = html.escape(node["text"], quote=False).replace("\n", "<br>")
                    else:
                        node.pop("html", None)
            elif isinstance(node.get("text"), str) and node["text"].strip():
                counter = PAGE_COUNTER.match(node["text"])
                if counter and int(counter.group(4)) == kit_total and int(counter.group(2)) == recipe_index[recipe["recipe"]]:
                    width = len(counter.group(2))
                    node["text"] = f"{counter.group(1)}{str(index).zfill(width)}{counter.group(3)}{str(total).zfill(len(counter.group(4)))}{counter.group(5)}"
                    node.pop("html", None)
                    renumbered.append(f"{slide_id}/{original}")
                elif not ORDINAL.match(node["text"]):
                    leftover.append({"node": f"{slide_id}/{original}", "kind": "text", "sample": node["text"][:120]})
            if original in images:
                node["src"] = image_value(images[original], base)
                node.pop("svg", None)
            if original in vectors:
                if not str(vectors[original]).lstrip().startswith("<svg"):
                    raise ValueError(f"Slide {slide_id}: {original} svg must be inline <svg> markup")
                node["svg"] = str(vectors[original])
                node.pop("src", None)
            if original in vector_texts:
                if not node.get("svg"):
                    raise ValueError(f"Slide {slide_id}: {original} has no inline SVG")
                try:
                    node["svg"] = fill_svg_texts(node["svg"], vector_texts[original])
                except ValueError as error:
                    raise ValueError(f"Slide {slide_id}: {original} {error}")
            elif original not in vectors and svg_texts(node.get("svg")):
                leftover.append({"node": f"{slide_id}/{original}", "kind": "svgText", "sample": svg_texts(node["svg"])})
            elif original not in vectors and node.get("svg"):
                # Icons can carry the example's subject (a hotel bell in a clinic deck); decorative ones may stay.
                leftover.append({"node": f"{slide_id}/{original}", "kind": "icon", "sample": node.get("alt") or node["svg"][:100]})
            if original in alts:
                node["alt"] = str(alts[original])
            elif node.get("type") == "image" and node.get("alt") and (original in images or original in vectors):
                leftover.append({"node": f"{slide_id}/{original}", "kind": "alt", "sample": node["alt"]})
            if original in styles:
                if not isinstance(styles[original], dict):
                    raise ValueError(f"Slide {slide_id}: {original} style must map CSS properties to values")
                node.setdefault("style", {}).setdefault("css", {}).update({key: str(value) for key, value in styles[original].items()})
            elif percent_styles(node):
                leftover.append({"node": f"{slide_id}/{original}", "kind": "style", "sample": percent_styles(node)})
            if node.get("src") == PLACEHOLDER:
                shape = frames.get(original, {})
                remaining_placeholders.append({"node": f"{slide_id}/{original}", **{key: shape[key] for key in ("aspect", "size") if key in shape}})
            node["id"] = f"{slide_id}-{original}"

        walk(root, apply)
        headings = []
        walk(root, lambda node: headings.append(node["text"]) if node.get("type") in {"heading", "subheading"} and isinstance(node.get("text"), str) and node["text"].strip() else None)
        title = entry.get("title") or (headings[0] if headings else recipe.get("title", ""))
        slide = {"id": slide_id, **copy.deepcopy(recipe["slide"]), "title": title, "notes": entry.get("notes", ""), "root": root}
        project["slides"].append(slide)
    return project, {"slides": len(project["slides"]), "contentLocale": project["contentLocale"], "unfilledImages": remaining_placeholders, "structureLost": structure_lost, "renumberedPageCounters": renumbered, "leftoverExample": leftover}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)
    ex = sub.add_parser("extract", help="Create style-kit.json from an example deck")
    ex.add_argument("source", type=Path, help="Example demo.html or its project JSON")
    ex.add_argument("--output", type=Path, required=True)
    ex.add_argument("--keep-images-under", type=int, default=24000, help="Keep raster data URLs shorter than this many characters (textures, small art)")
    co = sub.add_parser("compose", help="Create project.json from style-kit.json and a slide plan")
    co.add_argument("--style-kit", type=Path, required=True)
    co.add_argument("--plan", type=Path, required=True)
    co.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if args.command == "extract":
        result, report = extract(args.source, args.keep_images_under)
    else:
        kit = json.loads(args.style_kit.read_text(encoding="utf-8"))
        if kit.get("kind") != "editable-deck-style-kit":
            raise ValueError("Not a style kit: " + str(args.style_kit))
        result, report = compose(kit, json.loads(args.plan.read_text(encoding="utf-8")), args.plan.resolve().parent)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2 if args.command == "compose" else None) + "\n", encoding="utf-8")
    print(json.dumps({"ok": True, **report, "output": str(args.output.resolve())}, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError) as error:
        print("Style kit failed: " + str(error), file=sys.stderr)
        sys.exit(1)
