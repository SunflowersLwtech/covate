"""
TOON (Token Optimized Object Notation) Utility
==============================================

Provides functions to serialize and deserialize data in a token-optimized format.
TOON is essentially compact JSON with minimal whitespace and efficient separators.
"""

import json
from typing import Any

def dump_toon(data: Any) -> str:
    """
    Serialize data to TOON format (compact JSON).

    Args:
        data: The data to serialize.

    Returns:
        String representation in TOON format.
    """
    # Use most compact separators: ',' for items, ':' for keys
    # ensure_ascii=False allows UTF-8 characters without escape sequences (saving tokens)
    return json.dumps(data, separators=(',', ':'), ensure_ascii=False)

def load_toon(data: str) -> Any:
    """
    Deserialize data from TOON format.

    Args:
        data: The TOON string to deserialize.

    Returns:
        The deserialized Python object.
    """
    return json.loads(data)
