#!/usr/bin/env python3
"""Validate inputs and build a standalone deck using only bundled editor files."""

import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True

from schema_checks import FRAMEWORK, ValidationError, validate_project, validate_schema


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", type=Path, required=True, help="Raw project JSON or an exported project backup")
    parser.add_argument("--config", type=Path, help="Editor config; overrides settings embedded in a project backup")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    payload = json.loads(args.project.read_text(encoding="utf-8"))
    if isinstance(payload, dict) and "project" in payload:
        validate_schema(payload, "backup.schema.json")
        project, embedded_config = payload["project"], payload.get("editor")
    else:
        project, embedded_config = payload, None
    config = json.loads(args.config.read_text(encoding="utf-8")) if args.config else embedded_config
    if config is None:
        parser.error("--config is required when the input is a raw project without editor settings")
    report = validate_project(project, config)
    spec = importlib.util.spec_from_file_location("editable_deck_assembler", FRAMEWORK / "assemble.py")
    assembler = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(assembler)
    output = assembler.assemble(project, config)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(output, encoding="utf-8")
    print(json.dumps({"ok": True, **report, "bytes": len(output.encode("utf-8")), "output": str(args.output.resolve())}))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, ValidationError) as error:
        print("Build failed: " + str(error), file=sys.stderr)
        sys.exit(1)
