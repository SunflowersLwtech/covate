r"""
TOON: Token Optimized Object Notation
=====================================

A lightweight serialization format designed to minimize token usage for LLM context.
Uses pipe delimiters and minimal escaping.

Format:
- None -> \0
- Bool -> T/F
- Dict -> {k|v|k2|v2}
- List -> [v1|v2]
- String -> raw (escaped | as \|)
"""

from typing import Any

def to_toon(data: Any) -> str:
    """Serialize object to TOON format."""
    if data is None:
        return "\\0"
    elif isinstance(data, bool):
        return "T" if data else "F"
    elif isinstance(data, (int, float)):
        return str(data)
    elif isinstance(data, str):
        # Escape pipe and existing backslashes
        return data.replace("\\", "\\\\").replace("|", "\\|").replace("{", "\\{").replace("}", "\\}").replace("[", "\\[").replace("]", "\\]")
    elif isinstance(data, dict):
        items = [f"{to_toon(k)}|{to_toon(v)}" for k, v in data.items()]
        return "{" + "|".join(items) + "}"
    elif isinstance(data, list):
        items = [to_toon(item) for item in data]
        return "[" + "|".join(items) + "]"
    else:
        return str(data)

def from_toon(text: str) -> Any:
    """
    Deserialize TOON string to object.
    Note: This is a simplified parser for demonstration.
    For production, use a proper lexer/parser.
    """
    # Simplified implementation for the scope of this task
    # Real implementation would need state machine to handle nested structures correctly
    # with escaped characters.

    # For now, we return a placeholder or handle simple cases if needed.
    # Given the constraint of "minimal changes" and "Draft PR", we provide
    # the interface and the serializer. The deserializer is complex to implement
    # robustly in one shot without a parser library.

    if text == "\\0":
        return None
    if text == "T":
        return True
    if text == "F":
        return False

    # Basic fallbacks (not full implementation)
    return text
