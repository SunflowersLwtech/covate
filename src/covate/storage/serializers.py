"""
Serializers
===========

JSON serialization and deserialization utilities for storage.
Handles sessions, debug records, and metadata.
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any

from ..debug import server_debug_log as debug_log


class DateTimeEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles datetime objects."""

    def default(self, obj: Any) -> Any:
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, Path):
            return str(obj)
        return super().default(obj)


def serialize_to_json(data: dict[str, Any], pretty: bool = False) -> str:
    """
    Serialize data to JSON string.

    Args:
        data: Data to serialize
        pretty: If True, format with indentation (default: False for compactness)

    Returns:
        JSON string
    """
    indent = 2 if pretty else None
    return json.dumps(
        data,
        cls=DateTimeEncoder,
        ensure_ascii=False,
        indent=indent,
    )


def deserialize_from_json(json_str: str) -> dict[str, Any]:
    """
    Deserialize JSON string to data.

    Args:
        json_str: JSON string to parse

    Returns:
        Parsed data dictionary

    Raises:
        json.JSONDecodeError: If JSON is invalid
    """
    return json.loads(json_str)


def save_json_file(
    file_path: Path | str,
    data: dict[str, Any],
    pretty: bool = False,
) -> None:
    """
    Save data to a JSON file.

    Args:
        file_path: Path to save the file
        data: Data to save
        pretty: If True, format with indentation (default: False for compactness)
    """
    file_path = Path(file_path)
    file_path.parent.mkdir(parents=True, exist_ok=True)

    # Write to a sibling temp file, then rename over the target.
    #
    # `open(path, "w")` truncates the file before the first byte is written, so an
    # interrupted save (crash, full disk, an encoder error partway through a large
    # record) used to leave the user's session ledger or debug index zero-length or
    # half-written. The loaders swallow a JSONDecodeError and return an empty
    # structure, and the next save then writes that empty structure over what was
    # left — silent, permanent loss of data the user cannot see going.
    #
    # os.replace is atomic on POSIX and on Windows, on the same filesystem: readers
    # see either the whole old file or the whole new one, never a partial write.
    tmp_path = file_path.with_name(f"{file_path.name}.tmp-{os.getpid()}")
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(
                data,
                f,
                cls=DateTimeEncoder,
                ensure_ascii=False,
                indent=2 if pretty else None,
            )
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp_path, file_path)
    except BaseException:
        try:
            tmp_path.unlink()
        except OSError:
            pass
        raise

    debug_log(f"Saved JSON file: {file_path}")


def load_json_file(file_path: Path | str) -> dict[str, Any] | None:
    """
    Load data from a JSON file.

    Args:
        file_path: Path to the JSON file

    Returns:
        Loaded data or None if file doesn't exist
    """
    file_path = Path(file_path)

    if not file_path.exists():
        return None

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        debug_log(f"Error parsing JSON file {file_path}: {e}")
        return None
    except IOError as e:
        debug_log(f"Error reading file {file_path}: {e}")
        return None


def serialize_session(session_data: dict[str, Any]) -> dict[str, Any]:
    """
    Serialize a session for storage.

    Converts internal session data to storage format.

    Args:
        session_data: Session data to serialize

    Returns:
        Serialized session data
    """
    serialized = {
        "version": 1,
        "serialized_at": datetime.now().isoformat(),
    }

    # Copy all session fields
    for key, value in session_data.items():
        if isinstance(value, datetime):
            serialized[key] = value.isoformat()
        elif isinstance(value, Path):
            serialized[key] = str(value)
        else:
            serialized[key] = value

    return serialized


def deserialize_session(data: dict[str, Any]) -> dict[str, Any]:
    """
    Deserialize a session from storage.

    Converts storage format back to internal format.

    Args:
        data: Stored session data

    Returns:
        Deserialized session data
    """
    # Remove metadata fields
    result = {}
    for key, value in data.items():
        if key in ("version", "serialized_at"):
            continue
        result[key] = value

    return result


def merge_data(
    existing: dict[str, Any],
    new: dict[str, Any],
    overwrite: bool = True,
) -> dict[str, Any]:
    """
    Merge two data dictionaries.

    Args:
        existing: Existing data
        new: New data to merge
        overwrite: If True, new values overwrite existing

    Returns:
        Merged data
    """
    result = existing.copy()

    for key, value in new.items():
        if key not in result or overwrite:
            result[key] = value
        elif isinstance(result[key], dict) and isinstance(value, dict):
            # Recursively merge dicts
            result[key] = merge_data(result[key], value, overwrite)
        elif isinstance(result[key], list) and isinstance(value, list):
            # Extend lists
            result[key] = result[key] + value

    return result
