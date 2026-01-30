import sys
import os
import shutil
import json
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from mcp_creator_growth.storage.debug_index import DebugIndexManager
from mcp_creator_growth.storage.serializers import save_toon_file, load_toon_file

def main():
    test_dir = Path("test_toon_output")
    if test_dir.exists():
        shutil.rmtree(test_dir)
    test_dir.mkdir()

    print("Initializing DebugIndexManager...")
    manager = DebugIndexManager(str(test_dir))

    # Create records
    print("Creating records...")
    manager.record(
        context={
            "error_type": "TypeError",
            "error_message": "unsupported operand type(s) for +: 'int' and 'str'",
            "file": "main.py",
            "line": 10
        },
        cause="Attempted to add integer to string",
        solution="Cast string to int",
        tags=["python", "type_error"]
    )

    manager.record(
        context={
            "error_type": "ValueError",
            "error_message": "invalid literal for int() with base 10: 'foo'",
            "file": "utils.py",
            "line": 25
        },
        cause="Input was not a number",
        solution="Validate input before casting",
        tags=["python", "value_error", "validation"]
    )

    # Export TOON
    toon_path = test_dir / "debug_export.toon"
    print(f"Exporting to {toon_path}...")
    count = manager.export_toon(toon_path)
    print(f"Exported {count} records.")

    # Check file size
    toon_size = toon_path.stat().st_size
    print(f"TOON file size: {toon_size} bytes")

    # Read back
    print("Reading back TOON file...")
    loaded_data = load_toon_file(toon_path)
    print(f"Loaded {len(loaded_data)} records.")

    # Compare with JSON size (approximate)
    json_path = test_dir / "debug_export.json"
    all_records = manager.list_records(limit=100)
    full_records = [manager.get_record(r["id"]) for r in all_records]
    with open(json_path, "w") as f:
        json.dump(full_records, f)

    json_size = json_path.stat().st_size
    print(f"JSON file size: {json_size} bytes")

    reduction = (1 - toon_size / json_size) * 100
    print(f"Size reduction: {reduction:.2f}%")

    if toon_size < json_size:
        print("SUCCESS: TOON format is smaller.")
    else:
        print("WARNING: TOON format is NOT smaller (might be due to small sample size overhead).")

    # Verify content
    # Sort by timestamp/ID to ensure order matches if list_records order differs
    loaded_data.sort(key=lambda x: x["id"])
    first = loaded_data[0]

    # Note: CSV reader reads as strings, so we might need to be careful with exact matches if quoting happened
    # But DictReader handles CSV standard.

    if first["et"] == "TypeError" and "unsupported operand" in first["msg"]:
         print("SUCCESS: Content verification passed.")
    else:
         print(f"FAILURE: Content verification failed. Got: {first}")

    # Cleanup
    shutil.rmtree(test_dir)

if __name__ == "__main__":
    main()
