"""
Serializers
===========

JSON serialization and deserialization utilities for storage.
Handles sessions, debug records, and metadata.
"""

import csv
import json
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

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(
            data,
            f,
            cls=DateTimeEncoder,
            ensure_ascii=False,
            indent=2 if pretty else None,
        )

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


def save_toon_file(
    file_path: Path | str,
    data: list[dict[str, Any]],
) -> None:
    """
    Save list of dicts to TOON (CSV) format.

    Args:
        file_path: Path to save the file
        data: List of dictionaries to save
    """
    file_path = Path(file_path)
    file_path.parent.mkdir(parents=True, exist_ok=True)

    if not data:
        return

    # Collect all unique keys
    keys: set[str] = set()
    for item in data:
        keys.update(item.keys())
    fieldnames = sorted(list(keys))

    try:
        with open(file_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

            for item in data:
                row = {}
                for k, v in item.items():
                    if isinstance(v, (dict, list)):
                        row[k] = json.dumps(v, cls=DateTimeEncoder, ensure_ascii=False)
                    else:
                        row[k] = v
                writer.writerow(row)

        debug_log(f"Saved TOON file: {file_path}")

    except IOError as e:
        debug_log(f"Error saving TOON file {file_path}: {e}")


def load_toon_file(file_path: Path | str) -> list[dict[str, Any]]:
    """
    Load list of dicts from TOON (CSV) format.

    Args:
        file_path: Path to the TOON file

    Returns:
        List of dictionaries
    """
    file_path = Path(file_path)

    if not file_path.exists():
        return []

    try:
        with open(file_path, "r", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            data = []
            for row in reader:
                item = {}
                for k, v in row.items():
                    # Attempt to parse JSON strings back to objects
                    if isinstance(v, str) and (v.strip().startswith("{") or v.strip().startswith("[")):
                        try:
                            item[k] = json.loads(v)
                        except json.JSONDecodeError:
                            item[k] = v
                    else:
                        item[k] = v
                data.append(item)
            return data

    except (csv.Error, IOError) as e:
        debug_log(f"Error reading TOON file {file_path}: {e}")
        return []
