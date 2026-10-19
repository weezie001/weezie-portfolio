#!/usr/bin/env python3
"""Inspect exported native PPTX objects, speaker notes, and fixed 16:9 size."""

import argparse
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NAMESPACES = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
}


def normalized(text):
    return " ".join(text.split())


def text_characters(text):
    """Ignore layout whitespace and letter case (CSS text-transform is applied on export), keep every character in order."""
    return re.sub(r"\s+", "", text).casefold()


def paragraph_text(element):
    """Join rich-text runs without inventing spaces at formatting boundaries."""
    paragraphs = []
    for paragraph in element.findall(".//a:p", NAMESPACES):
        chunks = []
        for child in paragraph:
            if child.tag == "{" + NAMESPACES["a"] + "}br":
                chunks.append("\n")
            else:
                chunks.extend(text.text or "" for text in child.findall(".//a:t", NAMESPACES))
        paragraphs.append("".join(chunks))
    return "\n".join(paragraphs)


def validate_paragraph_properties(element, part):
    """OOXML permits no more than one paragraph-properties child per paragraph."""
    invalid = [index + 1 for index, paragraph in enumerate(element.findall(".//a:p", NAMESPACES)) if len(paragraph.findall("a:pPr", NAMESPACES)) > 1]
    if invalid:
        raise ValueError(part + " has duplicate paragraph properties in paragraph(s): " + ", ".join(map(str, invalid[:8])))


def inspect(filename, project=None):
    with zipfile.ZipFile(filename) as archive:
        presentation = ET.fromstring(archive.read("ppt/presentation.xml"))
        size = presentation.find("p:sldSz", NAMESPACES)
        if size is None:
            raise ValueError("Presentation dimensions are missing")
        width, height = int(size.attrib["cx"]), int(size.attrib["cy"])
        if width <= 0 or height <= 0 or abs(width / height - 16 / 9) > 0.00001:
            raise ValueError("Presentation is not fixed 16:9")
        slide_files = sorted(
            (name for name in archive.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)),
            key=lambda name: int(re.search(r"slide(\d+)", name).group(1)),
        )
        if not slide_files:
            raise ValueError("Presentation has no slides")
        if project is not None and len(slide_files) != len(project["slides"]):
            raise ValueError("PPTX and project slide counts differ")
        slides = []
        for index, name in enumerate(slide_files):
            xml = ET.fromstring(archive.read(name))
            validate_paragraph_properties(xml, name)
            shapes = xml.findall(".//p:sp", NAMESPACES)
            pictures = xml.findall(".//p:pic", NAMESPACES)
            # Rendered export: the slide's artwork is one background picture (or one picture named "Slide N").
            rendered = xml.find(".//p:bg//a:blip", NAMESPACES) is not None or any(
                (picture.find("p:nvPicPr/p:cNvPr", NAMESPACES).get("name", "") if picture.find("p:nvPicPr/p:cNvPr", NAMESPACES) is not None else "") == f"Slide {index + 1}"
                for picture in pictures)
            native_text = []
            for shape in shapes:
                if shape.find("p:txBody", NAMESPACES) is None:
                    continue
                properties = shape.find("p:nvSpPr/p:cNvPr", NAMESPACES)
                object_name = properties.get("name", "") if properties is not None else ""
                native_text.append({"nodeId": object_name.rsplit(" ", 1)[-1], "text": paragraph_text(shape)})
            paragraphs = xml.findall(".//a:pPr", NAMESPACES)
            notes_file = f"ppt/notesSlides/notesSlide{index + 1}.xml"
            note_text = ""
            if notes_file in archive.namelist():
                notes = ET.fromstring(archive.read(notes_file))
                validate_paragraph_properties(notes, notes_file)
                note_text = normalized(paragraph_text(notes))
            row = {
                "slide": index + 1,
                "nativeShapes": len(shapes),
                "nativeTextObjects": len(native_text),
                "independentPictures": len(pictures),
                "renderedBackground": rendered,
                "rtlParagraphs": sum(paragraph.attrib.get("rtl") == "1" for paragraph in paragraphs),
                "fontFaces": sorted({font.attrib.get("typeface", "") for font in xml.findall(".//a:latin", NAMESPACES) if font.attrib.get("typeface")}),
                "notesPart": notes_file in archive.namelist(),
                "singleParagraphProperties": True,
            }
            if project is not None:
                expected_texts = []
                expected_images = []

                def walk(node):
                    if node.get("text") and text_characters(node["text"]):
                        expected_texts.append({"id": node["id"], "text": node["text"], "type": node["type"]})
                    if node["type"] == "image":
                        expected_images.append(node["id"])
                    for child in node.get("children", []):
                        walk(child)

                walk(project["slides"][index]["root"])
                invalid_text = []
                for expected in expected_texts:
                    # A text node laid out in parts (number and label) exports as several boxes with the same node ID.
                    matched = [actual for actual in native_text if actual["nodeId"] == expected["id"]]
                    if not matched:
                        invalid_text.append(expected["id"] + ": missing independent text object")
                    else:
                        comparison = normalized if expected["type"] == "code" else text_characters
                        if comparison("".join(actual["text"] for actual in matched)) != comparison(expected["text"]):
                            invalid_text.append(expected["id"] + ": visible text differs")
                if invalid_text:
                    raise ValueError(f"Slide {index + 1} has {len(invalid_text)} invalid native text node(s): " + "; ".join(invalid_text[:8]))
                # Every image node must stay a separate picture object (named after its node ID), never part of the background.
                picture_ids = set()
                for picture in pictures:
                    properties = picture.find("p:nvPicPr/p:cNvPr", NAMESPACES)
                    if properties is not None:
                        picture_ids.add(properties.get("name", "").rsplit(" ", 1)[-1])
                missing_pictures = [image for image in expected_images if image not in picture_ids]
                if missing_pictures:
                    raise ValueError(f"Slide {index + 1} has image node(s) without an independent picture object: " + ", ".join(missing_pictures[:8]))
                expected_note = normalized(project["slides"][index].get("notes", ""))
                if expected_note and expected_note not in note_text:
                    raise ValueError(f"Slide {index + 1} speaker notes differ")
                row["expectedTextNodes"] = len(expected_texts)
                row["expectedImages"] = len(expected_images)
                row["textNodeIdsExact"] = True
            slides.append(row)
        return {
            "ok": True,
            "widthEmu": width,
            "heightEmu": height,
            "slides": slides,
            "checks": "native XML structure, objects and content; native-application editing remains separate",
        }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pptx", type=Path)
    parser.add_argument("--project", type=Path, help="Optional current project JSON for native text, image-count, and note comparison")
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    project = json.loads(args.project.read_text(encoding="utf-8")) if args.project else None
    if project is not None and "project" in project:
        project = project["project"]
    report = inspect(args.pptx, project)
    text = json.dumps(report, indent=2)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(text + "\n", encoding="utf-8")
    print(text)


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, zipfile.BadZipFile, ET.ParseError) as error:
        print("PPTX check failed: " + str(error), file=sys.stderr)
        sys.exit(1)
