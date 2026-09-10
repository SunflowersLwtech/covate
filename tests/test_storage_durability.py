"""A save that fails must not take the previous save with it, and a failed search
must not look like an empty one.

Every JSON write in the storage layer went through `save_json_file`, which opened the
target with mode "w" — truncating it before the first byte was written. An interrupted
save therefore left the user's session ledger or debug index zero-length or half-written.
The loaders swallow the resulting JSONDecodeError and return an empty structure
(debug_index._load_index:67, serializers.load_json_file), and the next save writes that
empty structure over what was left. The user's learning history goes without a word.

`debug_search` completed the silence: any exception returned {"results": [], "count": 0},
which is exactly what a successful search with no hits returns.
"""

import json

import pytest

from covate import server
from covate.storage.serializers import save_json_file


def test_interrupted_save_does_not_destroy_the_previous_file(tmp_path, monkeypatch):
    ledger = tmp_path / "index.json"
    save_json_file(ledger, {"records": [{"id": "r1", "cause": "the original data"}]})
    assert json.loads(ledger.read_text())["records"][0]["id"] == "r1"

    def die_partway(data, fp, **kwargs):
        fp.write('{"records": [{"id')  # a plausible half-written file
        raise OSError("No space left on device")

    monkeypatch.setattr(json, "dump", die_partway)
    with pytest.raises(OSError):
        save_json_file(ledger, {"records": [{"id": "r2"}]})
    monkeypatch.undo()

    surviving = json.loads(ledger.read_text())
    assert surviving["records"][0]["id"] == "r1", (
        "an interrupted save destroyed the previous contents of the file"
    )


def test_interrupted_save_leaves_no_temp_file_behind(tmp_path, monkeypatch):
    target = tmp_path / "index.json"
    save_json_file(target, {"ok": True})

    def die(data, fp, **kwargs):
        raise OSError("No space left on device")

    monkeypatch.setattr(json, "dump", die)
    with pytest.raises(OSError):
        save_json_file(target, {"ok": False})
    monkeypatch.undo()

    strays = [p.name for p in tmp_path.iterdir() if p.name != "index.json"]
    assert not strays, f"a failed save left debris in the user's project: {strays}"


def test_saved_file_is_readable_and_correct(tmp_path):
    """Guard the happy path: atomicity must not cost correctness."""
    target = tmp_path / "sub" / "dir" / "record.json"
    payload = {"summary": "非 ASCII 摘要", "n": 3}
    save_json_file(target, payload)
    assert json.loads(target.read_text(encoding="utf-8")) == payload


async def test_debug_search_failure_is_distinguishable_from_no_results(tmp_path, monkeypatch):
    from covate.storage import DebugRetrieval

    def boom(self, *args, **kwargs):
        raise RuntimeError("index is corrupt")

    monkeypatch.setattr(DebugRetrieval, "search", boom)

    broken = await server.debug_search.fn(query="TypeError", project_directory=str(tmp_path))

    assert broken.get("error"), (
        "a search that crashed returned the same thing as a search that found nothing: "
        f"{broken!r}"
    )
    assert "index is corrupt" in broken["error"]


async def test_debug_search_with_no_matches_reports_no_error(tmp_path):
    """The negative control: a genuinely empty history must not claim a failure."""
    empty = await server.debug_search.fn(query="TypeError", project_directory=str(tmp_path))
    assert empty["count"] == 0
    assert "error" not in empty, f"an empty debug history was reported as a failure: {empty!r}"
