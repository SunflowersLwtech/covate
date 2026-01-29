"""
TOON (Token Optimized Object Notation) Serializer
=================================================

A lightweight, pipe-delimited format designed to minimize token usage
for list-based data structures compared to JSON.
"""

import json
from typing import Any

def serialize_to_toon(data: list[dict[str, Any]], fields: list[str] | None = None) -> str:
    """
    Serialize a list of dictionaries to TOON format.

    Format:
    |field1|field2|...|
    |value1|value2|...|

    Args:
        data: List of dictionaries to serialize
        fields: Optional list of fields to include. If None, uses keys from first item.

    Returns:
        TOON formatted string
    """
    if not data:
        return ""

    # Determine fields
    if fields is None:
        # Aggregate all keys from all items to ensure coverage, or just take first?
        # For simplicity and stability, taking keys from the first item is standard for tabular data
        # but let's check if we can be smarter.
        # Just use first item for this prototype.
        fields = list(data[0].keys())

    # Create header
    lines = ["|" + "|".join(fields) + "|"]

    # Create rows
    for item in data:
        row = []
        for field in fields:
            val = item.get(field, "")
            # Convert non-string values to string representation
            if isinstance(val, (dict, list)):
                val_str = json.dumps(val, ensure_ascii=False)
            elif val is None:
                val_str = ""
            else:
                val_str = str(val)

            # Simple escaping: replace pipes with broken bars to prevent delimiter collision
            # Replace newlines to keep one record per line
            val_str = val_str.replace("|", "¦").replace("\n", " ")
            row.append(val_str)

        lines.append("|" + "|".join(row) + "|")

    return "\n".join(lines)


def deserialize_from_toon(toon_str: str) -> list[dict[str, Any]]:
    """
    Deserialize TOON string to list of dictionaries.

    Args:
        toon_str: TOON formatted string

    Returns:
        List of dictionaries
    """
    if not toon_str.strip():
        return []

    lines = [line.strip() for line in toon_str.split("\n") if line.strip()]
    if not lines:
        return []

    # Parse header
    header_line = lines[0]
    if not header_line.startswith("|") or not header_line.endswith("|"):
        return []

    fields = [f for f in header_line[1:-1].split("|")]

    result = []
    for line in lines[1:]:
        if not line.startswith("|") or not line.endswith("|"):
            continue

        # Remove first and last pipe only, then split
        # This preserves empty fields at start/end
        content = line[1:-1]
        values = content.split("|")

        # Handle mismatch length by padding
        if len(values) < len(fields):
            values.extend([""] * (len(fields) - len(values)))

        item = {}
        for i, field in enumerate(fields):
            if i >= len(values):
                break

            val_str = values[i].replace("¦", "|")
            final_val: Any = val_str

            # Try to interpret as JSON if it looks like it (simple heuristic)
            if (val_str.startswith("{") and val_str.endswith("}")) or \
               (val_str.startswith("[") and val_str.endswith("]")):
                try:
                    final_val = json.loads(val_str)
                except json.JSONDecodeError:
                    pass

            # Try to interpret as number if still string and looks like int
            if isinstance(final_val, str) and final_val.isdigit():
                 final_val = int(final_val)

            item[field] = final_val

        result.append(item)

    return result
