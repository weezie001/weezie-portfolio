#!/usr/bin/env python3
"""Shrink embedded raster images so a single-file deck stays well under the size budget.

Re-encodes oversized PNG/JPEG/WebP data URLs (image nodes and contentCSS backgrounds) as
WebP, capped at a long edge suited to a 1280x720 page. Text, layout and vector art are
untouched; an image is replaced only when the result is smaller. Requires Pillow.
"""

import argparse
import base64
import io
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True

DATA_URL = re.compile(r"data:image/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)")


def load(path):
    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() in {".html", ".htm"}:
        match = re.search(r'(<script id="deck-data" type="application/json">)(.*?)(</script>)', text, re.S)
        if not match:
            raise ValueError("No embedded project found in " + str(path))
        return json.loads(match.group(2)), ("html", text, match)
    payload = json.loads(text)
    return payload, ("json", None, None)


def save(path, payload, source):
    kind, text, match = source
    if kind == "html":
        encoded = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")
        path.write_text(text[:match.start(2)] + encoded + text[match.end(2):], encoding="utf-8")
    else:
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="project.json, project backup JSON or built presentation.html")
    parser.add_argument("--output", type=Path, help="Defaults to rewriting the input in place")
    parser.add_argument("--max-edge", type=int, default=1920, help="Longest edge in pixels (default 1920)")
    parser.add_argument("--quality", type=int, default=82, help="WebP quality 1-100 (default 82)")
    parser.add_argument("--min-kb", type=int, default=250, help="Leave images smaller than this alone unless they exceed --max-edge")
    args = parser.parse_args()
    try:
        from PIL import Image
    except ImportError:
        parser.exit(1, "Pillow is required: python3 -m pip install Pillow\n")

    payload, source = load(args.input)
    stats = {"images": 0, "optimized": 0, "beforeBytes": 0, "afterBytes": 0}
    cache = {}

    def shrink(match):
        whole = match.group(0)
        if whole in cache:
            return cache[whole]
        raw = base64.b64decode(match.group(2))
        stats["images"] += 1
        stats["beforeBytes"] += len(raw)
        result = whole
        try:
            image = Image.open(io.BytesIO(raw))
            if getattr(image, "is_animated", False):
                raise ValueError("animated")
            image.load()
            longest = max(image.size)
            if longest > args.max_edge or len(raw) > args.min_kb * 1024:
                if longest > args.max_edge:
                    scale = args.max_edge / longest
                    image = image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))), Image.LANCZOS)
                if image.mode not in {"RGB", "RGBA"}:
                    image = image.convert("RGBA" if "A" in image.getbands() or "transparency" in image.info else "RGB")
                out = io.BytesIO()
                image.save(out, "WEBP", quality=args.quality, method=6)
                if out.tell() < len(raw):
                    result = "data:image/webp;base64," + base64.b64encode(out.getvalue()).decode("ascii")
                    stats["optimized"] += 1
        except (OSError, ValueError):
            pass
        stats["afterBytes"] += len(base64.b64decode(result.split(",", 1)[1]))
        cache[whole] = result
        return result

    def visit(value):
        if isinstance(value, str):
            return DATA_URL.sub(shrink, value) if "data:image/" in value else value
        if isinstance(value, list):
            return [visit(item) for item in value]
        if isinstance(value, dict):
            return {key: visit(item) for key, item in value.items()}
        return value

    payload = visit(payload)
    target = args.output or args.input
    target.parent.mkdir(parents=True, exist_ok=True)
    save(target, payload, source)
    stats["savedBytes"] = stats["beforeBytes"] - stats["afterBytes"]
    print(json.dumps({"ok": True, **stats, "output": str(target.resolve())}))


if __name__ == "__main__":
    main()
