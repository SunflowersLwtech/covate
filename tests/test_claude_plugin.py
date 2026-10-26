"""The Claude Code plugin files stay in step with the package they ship.

The skill and commands tell an agent to run `covate review <subcommand>`; if a subcommand is
renamed, or the marketplace and plugin manifests drift apart, the agent is told to run
something that does not exist. These tests read the files as the plugin loader would.
"""

import json
import re
from pathlib import Path

import covate
from covate.review.cli import _parser

ROOT = Path(__file__).resolve().parent.parent
PLUGIN = json.loads((ROOT / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))
MARKET = json.loads((ROOT / ".claude-plugin" / "marketplace.json").read_text(encoding="utf-8"))
SKILL = ROOT / "skills" / "covate-review" / "SKILL.md"
COMMANDS = sorted((ROOT / "commands").glob("*.md"))


def frontmatter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    assert text.startswith("---\n"), f"{path.name} has no frontmatter"
    block = text.split("---\n", 2)[1]
    return dict(line.split(": ", 1) for line in block.splitlines() if re.match(r"^[a-z-]+: ", line))


def real_subcommands() -> set[str]:
    sub = next(a for a in _parser()._actions if a.dest == "command")
    return set(sub.choices)


def test_marketplace_lists_the_plugin_under_its_own_name_and_version():
    [entry] = MARKET["plugins"]
    assert entry["name"] == PLUGIN["name"]
    assert entry["version"] == PLUGIN["version"] == covate.__version__
    assert (ROOT / entry["source"]).resolve() == ROOT


def test_the_skill_is_named_after_its_folder_and_has_a_description():
    fm = frontmatter(SKILL)
    assert fm["name"] == SKILL.parent.name == "covate-review"
    assert len(fm["description"]) > 20


def test_every_command_has_a_description():
    assert [p.name for p in COMMANDS] == ["review-record.md", "review.md"]
    for p in COMMANDS:
        assert frontmatter(p).get("description"), p.name


def test_every_covate_review_subcommand_the_skill_names_exists():
    text = SKILL.read_text(encoding="utf-8")
    named = set(re.findall(r"covate review (?:--\S+ \S+ )*([a-z]+)", text))
    assert named, "the skill no longer shows any covate review command"
    assert named <= real_subcommands(), named - real_subcommands()
    # and it teaches the whole loop
    assert {"page", "record", "due", "status"} <= named


def test_the_commands_point_at_skill_steps_that_exist():
    skill = SKILL.read_text(encoding="utf-8")
    for p in COMMANDS:
        for step in re.findall(r'"([^"]+)" steps', p.read_text(encoding="utf-8")):
            assert f"## {step}" in skill, f"{p.name} refers to a missing section: {step}"


def test_the_plugin_installs_no_hooks():
    # A review nudge must never be able to block or slow a tool call. A plugin's hooks can be
    # declared in plugin.json, in a hooks/ folder, or inline in its marketplace entry.
    assert "hooks" not in PLUGIN
    assert not (ROOT / "hooks").exists()
    for entry in MARKET["plugins"]:
        assert "hooks" not in entry, f"marketplace entry {entry['name']} declares hooks"
