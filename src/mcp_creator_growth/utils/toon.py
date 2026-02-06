"""
TOON (Token Optimized Object Notation) Utilities
================================================

Provides utilities for serializing and deserializing data in TOON format.
TOON is a header-based format designed to reduce token usage by eliminating
repetitive keys in lists of dictionaries.
"""

import json
import csv
import io
from typing import Any


def dump_toon(data: list[dict[str, Any]]) -> str:
    """
    Serialize a list of dictionaries to TOON format string.
    Uses pipe-separated values with standard CSV quoting rules.

    Format:
    #TOON v1
    key1|key2|key3
    val1|val2|val3
    ...
    """
    if not data:
        return "#TOON v1\n"

    # Determine headers from the first record
    headers = list(data[0].keys())

    output = io.StringIO()
    output.write("#TOON v1\n")

    # Use csv writer for robust handling of delimiters and quotes
    writer = csv.writer(output, delimiter='|', lineterminator='\n')
    writer.writerow(headers)

    for item in data:
        row = []
        for header in headers:
            val = item.get(header)
            if val is None:
                row.append("")
            elif isinstance(val, (dict, list)):
                # JSON dump complex types
                row.append(json.dumps(val, ensure_ascii=False))
            elif isinstance(val, bool):
                # Standardize bools
                row.append(str(val).lower())
            else:
                # Let csv writer handle quoting for strings with pipes
                row.append(str(val))
        writer.writerow(row)

    return output.getvalue()


def load_toon(data: str) -> list[dict[str, Any]]:
    """
    Deserialize a TOON format string to a list of dictionaries.
    """
    # Remove BOM if present and strip leading/trailing whitespace
    data = data.strip()
    if not data.startswith("#TOON"):
        return []

    lines = data.splitlines()
    if len(lines) < 2:
        return []

    # Skip the version line
    csv_lines = lines[1:]

    # Use csv reader
    f = io.StringIO("\n".join(csv_lines))
    reader = csv.reader(f, delimiter='|')

    try:
        headers = next(reader)
    except StopIteration:
        return []

    result = []

    for values in reader:
        item: dict[str, Any] = {}
        for i, header in enumerate(headers):
            if i >= len(values):
                val_str = ""
            else:
                val_str = values[i]

            # Attempt type inference
            if val_str == "":
                item[header] = None
            elif val_str.startswith(("{", "[", '"')) and (val_str.endswith("}") or val_str.endswith("]") or val_str.endswith('"')):
                try:
                    item[header] = json.loads(val_str)
                except json.JSONDecodeError:
                    item[header] = val_str
            elif val_str.isdigit():
                item[header] = int(val_str)
            elif val_str.lower() == "true":
                item[header] = True
            elif val_str.lower() == "false":
                item[header] = False
            else:
                item[header] = val_str

        result.append(item)

    return result
