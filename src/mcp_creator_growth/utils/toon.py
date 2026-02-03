"""
TOON: Token Optimized Object Notation
=====================================

A lightweight serialization format designed to minimize token usage
for lists of uniform dictionaries (like logs or records).

Format:
- Header row defines keys: key1|key2|key3
- Subsequent rows are values: val1|val2|val3
- Delimiter: '|' (Pipe)
- Escape character: '\' (Backslash)
- Escapes:
  - \| -> |
  - \\ -> \
  - \n -> Newline
  - \r -> Carriage return
  - \0 -> Null (used for None)
"""

from typing import Any


class ToonSerializer:
    """Serializer for Token Optimized Object Notation."""

    DELIMITER = "|"
    ESCAPE_CHAR = "\\"

    @staticmethod
    def _escape(value: Any) -> str:
        """Escape special characters in value."""
        if value is None:
            return "\\0"

        # Convert to string
        s = str(value)

        # Escape backslashes first to avoid double escaping
        s = s.replace("\\", "\\\\")

        # Escape delimiters
        s = s.replace("|", "\\|")

        # Escape control characters
        s = s.replace("\n", "\\n")
        s = s.replace("\r", "\\r")

        return s

    @staticmethod
    def _parse_row(row: str) -> list[Any]:
        """Parse a row, handling unescaping and types."""
        parts = []
        current: list[str] = []
        escaped = False

        for char in row:
            if escaped:
                if char == 'n':
                    current.append('\n')
                elif char == 'r':
                    current.append('\r')
                elif char == '0':
                    current.append('\0') # Sentinel for None
                else:
                    # For \|, \\, and others, just keep the char
                    current.append(char)
                escaped = False
            elif char == ToonSerializer.ESCAPE_CHAR:
                escaped = True
            elif char == ToonSerializer.DELIMITER:
                parts.append("".join(current))
                current = []
            else:
                current.append(char)

        parts.append("".join(current))

        # Post-process for None
        result = []
        for part in parts:
            if part == '\0':
                result.append(None)
            else:
                result.append(part)
        return result

    @staticmethod
    def dumps(data: list[dict[str, Any]]) -> str:
        """
        Serialize a list of dictionaries to TOON string.

        Args:
            data: List of dictionaries. Must have uniform keys (or superset).

        Returns:
            TOON formatted string.
        """
        if not data:
            return ""

        # Extract all unique keys
        keys = sorted({k for record in data for k in record.keys()})

        lines = []
        # Header (keys are assumed to be safe identifiers, but we escape just in case)
        lines.append(ToonSerializer.DELIMITER.join([ToonSerializer._escape(k) for k in keys]))

        # Rows
        for record in data:
            values = []
            for k in keys:
                val = record.get(k)
                values.append(ToonSerializer._escape(val))
            lines.append(ToonSerializer.DELIMITER.join(values))

        return "\n".join(lines)

    @staticmethod
    def loads(toon_str: str) -> list[dict[str, Any]]:
        """
        Deserialize TOON string to list of dictionaries.

        Args:
            toon_str: TOON formatted string.

        Returns:
            List of dictionaries.
        """
        if not toon_str.strip():
            return []

        lines = toon_str.strip().split("\n")
        if not lines:
            return []

        header = lines[0]
        # Parse keys (handling potential escapes in keys)
        keys = [str(k) for k in ToonSerializer._parse_row(header)]

        result = []
        for line in lines[1:]:
            if not line:
                continue
            values = ToonSerializer._parse_row(line)

            # Map keys to values
            record = {}
            for i, key in enumerate(keys):
                if i < len(values):
                    record[key] = values[i]
            result.append(record)

        return result
