"""Standard-library validation for the bundled presentation schema vocabulary."""

import json
import math
import re
from pathlib import Path

FRAMEWORK = Path(__file__).resolve().parents[1] / "references" / "framework"


class ValidationError(ValueError):
    """A presentation fails a schema or cross-field constraint."""


def inline_urls_only(value):
    """Inspect whole CSS URL tokens; quoted data payloads may contain inner URL text."""
    source = re.sub(r"/\*[\s\S]*?\*/", "", value)
    pattern = re.compile(r'''url\(\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^)]*))\s*\)''', re.I)
    for match in pattern.finditer(source):
        url = next((part for part in match.groups() if part is not None), "").strip()
        if not re.match(r"^(?:data:(?:image|font|application)/|#[-a-zA-Z0-9_:.]+$)", url, re.I):
            return False
    return True


def _same(left, right):
    return json.dumps(left, sort_keys=True) == json.dumps(right, sort_keys=True)


def _matches_type(value, kind):
    return {
        "object": isinstance(value, dict),
        "array": isinstance(value, list),
        "string": isinstance(value, str),
        "number": isinstance(value, (int, float)) and not isinstance(value, bool),
        "integer": isinstance(value, int) and not isinstance(value, bool),
        "boolean": isinstance(value, bool),
        "null": value is None,
    }.get(kind, False)


def _resolve(ref, root):
    registered = {
        "urn:editable-deck:project-schema:1": "project.schema.json",
        "urn:editable-deck:config-schema:1": "config.schema.json",
        "urn:editable-deck:backup-schema:1": "backup.schema.json",
    }
    if ref in registered:
        resolved = json.loads((FRAMEWORK / registered[ref]).read_text(encoding="utf-8"))
        return resolved, resolved
    if not ref.startswith("#/"):
        raise ValidationError("Only bundled presentation schema references are supported")
    resolved = root
    for component in ref[2:].split("/"):
        resolved = resolved[component.replace("~1", "/").replace("~0", "~")]
    return resolved, root


def _errors(value, schema, root, path="$", depth=0):
    if depth > 400:
        return [path + ": excessive schema or document depth"]
    if schema is True:
        return []
    if schema is False:
        return [path + ": value is forbidden"]
    if "$ref" in schema:
        resolved, reference_root = _resolve(schema["$ref"], root)
        return _errors(value, resolved, reference_root, path, depth + 1)
    errors = []
    kind = schema.get("type")
    if kind is not None:
        kinds = kind if isinstance(kind, list) else [kind]
        if not any(_matches_type(value, item) for item in kinds):
            return [path + ": expected " + "/".join(kinds)]
    if "const" in schema and not _same(value, schema["const"]):
        errors.append(path + ": unexpected constant")
    if "enum" in schema and not any(_same(value, item) for item in schema["enum"]):
        errors.append(path + ": unsupported value")
    for item in schema.get("allOf", []):
        errors.extend(_errors(value, item, root, path, depth + 1))
    if "anyOf" in schema and not any(
        not _errors(value, item, root, path, depth + 1) for item in schema["anyOf"]
    ):
        errors.append(path + ": no permitted alternative matches")
    if "oneOf" in schema and sum(
        not _errors(value, item, root, path, depth + 1) for item in schema["oneOf"]
    ) != 1:
        errors.append(path + ": exactly one alternative must match")
    if "not" in schema and not _errors(value, schema["not"], root, path, depth + 1):
        errors.append(path + ": forbidden combination")
    if "if" in schema:
        branch = "then" if not _errors(value, schema["if"], root, path, depth + 1) else "else"
        if branch in schema:
            errors.extend(_errors(value, schema[branch], root, path, depth + 1))
    if isinstance(value, dict):
        if len(value) < schema.get("minProperties", 0):
            errors.append(path + ": too few properties")
        if len(value) > schema.get("maxProperties", float("inf")):
            errors.append(path + ": too many properties")
        for key in schema.get("required", []):
            if key not in value:
                errors.append(path + ": missing " + key)
        properties = schema.get("properties", {})
        patterns = schema.get("patternProperties", {})
        for key, child in value.items():
            if "propertyNames" in schema:
                errors.extend(_errors(key, schema["propertyNames"], root, path + ".<" + key + ">", depth + 1))
            matched = []
            if key in properties:
                matched.append(properties[key])
            matched.extend(item for pattern, item in patterns.items() if re.search(pattern, key))
            if not matched:
                extra = schema.get("additionalProperties", True)
                if extra is False:
                    errors.append(path + ": unsupported field " + key)
                elif isinstance(extra, dict):
                    matched.append(extra)
            for item in matched:
                errors.extend(_errors(child, item, root, path + "." + key, depth + 1))
    if isinstance(value, list):
        if len(value) < schema.get("minItems", 0):
            errors.append(path + ": too few items")
        if len(value) > schema.get("maxItems", float("inf")):
            errors.append(path + ": too many items")
        if "items" in schema:
            for index, child in enumerate(value):
                errors.extend(_errors(child, schema["items"], root, f"{path}[{index}]", depth + 1))
    if isinstance(value, str):
        if len(value) < schema.get("minLength", 0):
            errors.append(path + ": string is too short")
        if len(value) > schema.get("maxLength", float("inf")):
            errors.append(path + ": string is too long")
        if "pattern" in schema and not re.search(schema["pattern"], value):
            errors.append(path + ": invalid string format")
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if not math.isfinite(value):
            errors.append(path + ": number must be finite")
        for bound, fails in (
            ("minimum", lambda number: value < number),
            ("maximum", lambda number: value > number),
            ("exclusiveMinimum", lambda number: value <= number),
            ("exclusiveMaximum", lambda number: value >= number),
        ):
            if bound in schema and fails(schema[bound]):
                errors.append(path + ": numeric bound failed")
    return errors


def validate_schema(value, filename):
    schema = json.loads((FRAMEWORK / filename).read_text(encoding="utf-8"))
    errors = _errors(value, schema, schema)
    if errors:
        raise ValidationError("\n".join(errors[:25]))


def validate_project(project, config):
    validate_schema(project, "project.schema.json")
    validate_schema(config, "config.schema.json")
    seen_slides = set()
    seen_nodes = set()
    text_count = image_count = 0

    def presentation_surface(owner):
        css = owner.get("style", {}).get("css", {})
        for value in css.values():
            if re.search(r"javascript:|expression\s*\(|@import", value, re.I) or not inline_urls_only(value):
                raise ValidationError("Presentation CSS must remain local and inert")
        attributes = owner.get("attributes", {})
        reserved = {"data-node", "data-type", "data-drag", "data-act", "data-slide", "data-card-index"}
        if reserved.intersection(attributes):
            raise ValidationError("Presentation attributes must not override editor controls")

    def walk(node, depth=0):
        nonlocal text_count, image_count
        if depth > 20:
            raise ValidationError("Node depth exceeds 20")
        node_id = node["id"]
        if re.search(r'[\"<>\s]', node_id) or node_id in seen_nodes:
            raise ValidationError("Invalid or duplicate node ID: " + node_id)
        seen_nodes.add(node_id)
        if len(seen_nodes) > 10000:
            raise ValidationError("Project exceeds 10,000 nodes")
        children = node.get("children", [])
        presentation_surface(node)
        if "weights" in node:
            if node["type"] != "columns" or len(node["weights"]) != len(children):
                raise ValidationError("Column weights must match their logical children: " + node_id)
        if "text" in node:
            text_count += 1
        if node["type"] == "image":
            image_count += 1
        for child in children:
            walk(child, depth + 1)

    for slide in project["slides"]:
        slide_id = slide["id"]
        if re.search(r'[\"<>\s]', slide_id) or slide_id in seen_slides:
            raise ValidationError("Invalid or duplicate slide ID: " + slide_id)
        seen_slides.add(slide_id)
        presentation_surface(slide)
        if slide["root"]["type"] != "stack":
            raise ValidationError("Slide root must be a stack")
        walk(slide["root"])
    css = project.get("contentCSS", "")
    if re.search(r"@(?:import|namespace)|javascript:|expression\s*\(", css, re.I) or not inline_urls_only(css):
        raise ValidationError("Imported presentation stylesheet must have no network or executable dependencies")
    rule_source = re.sub(r"/\*[\s\S]*?\*/", "", css)
    rule_source = re.sub(r'''url\(\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^)]*))\s*\)''', "url()", rule_source, flags=re.I)
    for animation in re.finditer(r"@(?:-webkit-)?keyframes\s+([^\s{]+)", rule_source, re.I):
        if not animation.group(1).strip("\"'").startswith("Imported-"):
            raise ValidationError("Imported animation names must use the Imported- namespace")
    for face in re.finditer(r"@font-face\s*\{([^{}]*)\}", css, re.I):
        properties = face.group(1)
        if not re.search(r"font-family\s*:\s*['\"]?Imported-", properties, re.I) or not re.search(r"src\s*:\s*url\(\s*['\"]?data:(?:font|application)/", properties, re.I):
            raise ValidationError("Imported fonts require scoped family aliases and embedded font data")
    return {
        "slides": len(seen_slides),
        "nodes": len(seen_nodes),
        "textNodes": text_count,
        "imageNodes": image_count,
        "uiLocale": config.get("uiLocale", "auto"),
        "contentLocale": project.get("contentLocale", config.get("contentLocale", "auto")),
        "contentDirection": project.get("contentDirection", config.get("contentDirection", "auto")),
    }
