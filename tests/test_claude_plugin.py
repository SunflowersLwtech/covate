"""The Claude Code plugin files stay in step with the package they ship.

The skill and commands tell an agent to run `covate review <subcommand>`; if a subcommand is
renamed, or the marketplace and plugin manifests drift apart, the agent is told to run
something that does not exist. These tests read the files as the plugin loader would.

The plugin lives in plugins/covate, not at the repository root: the plugin directory scans
everything in a plugin's folder, and the root also holds the website, the tests and the
images. Its server and commands run one pinned commit of this repository with uvx.
"""

import json
import re
import struct
import subprocess
from pathlib import Path

from covate.review.cli import _parser

ROOT = Path(__file__).resolve().parent.parent
PLUGIN_DIR = ROOT / "plugins" / "covate"
PLUGIN = json.loads((PLUGIN_DIR / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))
MARKET = json.loads((ROOT / ".claude-plugin" / "marketplace.json").read_text(encoding="utf-8"))
MCP = json.loads((PLUGIN_DIR / ".mcp.json").read_text(encoding="utf-8"))
SKILL = PLUGIN_DIR / "skills" / "covate-review" / "SKILL.md"
COMMANDS = sorted((PLUGIN_DIR / "commands").glob("*.md"))
SOURCE = "git+https://github.com/SunflowersLwtech/covate@"
PIN = MCP["mcpServers"]["covate"]["args"][1].removeprefix(SOURCE)
UVX = f'uvx --from "{SOURCE}{PIN}" '


def frontmatter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    assert text.startswith("---\n"), f"{path.name} has no frontmatter"
    block = text.split("---\n", 2)[1]
    return dict(line.split(": ", 1) for line in block.splitlines() if re.match(r"^[a-z-]+: ", line))


def real_subcommands() -> set[str]:
    sub = next(a for a in _parser()._actions if a.dest == "command")
    return set(sub.choices)


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, check=True, capture_output=True, text=True).stdout


def test_marketplace_lists_the_plugin_under_its_own_name_and_version():
    [entry] = MARKET["plugins"]
    assert entry["name"] == PLUGIN["name"]
    # The plugin's version is the version of the commit it pins (checked below), which can lag
    # covate.__version__ between a release commit and the commit that moves the pin to it.
    assert entry["version"] == PLUGIN["version"]
    assert (ROOT / entry["source"]).resolve() == PLUGIN_DIR


def test_the_repository_root_is_not_a_plugin_itself():
    # With a plugin.json at the root, the directory would scan the whole repository as the plugin.
    assert not (ROOT / ".claude-plugin" / "plugin.json").exists()
    assert not (ROOT / "skills").exists() and not (ROOT / "commands").exists()


def test_the_server_runs_one_pinned_commit():
    assert re.fullmatch(r"[0-9a-f]{40}", PIN), PIN
    assert MCP == {"mcpServers": {"covate": {
        "type": "stdio", "command": "uvx", "args": ["--from", f"{SOURCE}{PIN}", "covate"]}}}


def test_the_pinned_commit_is_this_version_and_has_the_review_commands():
    # A pin to a commit that is not in this repository's history, or that is an older release,
    # installs something the skill does not describe. CI checks out full history for this.
    git("cat-file", "-e", f"{PIN}^{{commit}}")
    pyproject = git("show", f"{PIN}:pyproject.toml")
    assert f'\nversion = "{PLUGIN["version"]}"\n' in pyproject
    cli = git("show", f"{PIN}:src/covate/review/cli.py")
    for name in real_subcommands():
        assert f'"{name}"' in cli, name


def test_the_skill_is_named_after_its_folder_and_has_a_description():
    fm = frontmatter(SKILL)
    assert fm["name"] == SKILL.parent.name == "covate-review"
    assert len(fm["description"]) > 20


def test_every_command_has_a_description():
    assert [p.name for p in COMMANDS] == ["review-record.md", "review.md"]
    for p in COMMANDS:
        assert frontmatter(p).get("description"), p.name


def test_no_command_pre_approves_the_shell():
    # The user approves each command the skill runs; a command must not grant Bash wholesale.
    for p in COMMANDS:
        block = p.read_text(encoding="utf-8").split("---\n", 2)[1]
        assert "Bash" not in block, p.name


def test_every_covate_review_subcommand_the_skill_names_exists():
    text = SKILL.read_text(encoding="utf-8")
    named = set(re.findall(r"covate review (?:--\S+ \S+ )*([a-z]+)", text))
    assert named, "the skill no longer shows any covate review command"
    assert named <= real_subcommands(), named - real_subcommands()
    # and it teaches the whole loop
    assert {"page", "record", "due", "status"} <= named
    # `record` reads the JSON that `foldrender answers PAGE --json` prints; without --json FoldRender
    # prints text for people, which `record` refuses, so nothing would be scored.
    assert f"`foldrender answers <page> --json | {UVX}covate review record`" in text


def test_every_covate_review_command_runs_the_pinned_commit():
    # A `covate` already on PATH can be an older install with no `review`: it would start the MCP
    # server and print a banner instead of the ledger. So no file may tell an agent to run it bare,
    # and every command runs the same commit as the server.
    for p in [SKILL, *COMMANDS]:
        text = p.read_text(encoding="utf-8")
        for m in re.finditer(r"covate review", text):
            assert text[: m.start()].endswith(UVX), f"{p.name} runs `{text[max(0, m.start() - 60):][:100]}`"
    wrapped = re.findall(re.escape(UVX) + r"covate review ([a-z]+)", SKILL.read_text(encoding="utf-8"))
    assert {"due", "page", "record", "status"} <= set(wrapped)  # the check above did not pass on nothing


def test_the_commands_point_at_skill_steps_that_exist():
    skill = SKILL.read_text(encoding="utf-8")
    for p in COMMANDS:
        for step in re.findall(r'"([^"]+)" steps', p.read_text(encoding="utf-8")):
            assert f"## {step}" in skill, f"{p.name} refers to a missing section: {step}"


def test_the_plugin_installs_no_hooks():
    # A review nudge must never be able to block or slow a tool call. A plugin's hooks can be
    # declared in plugin.json, in a hooks/ folder, or inline in its marketplace entry.
    assert "hooks" not in PLUGIN
    assert not (PLUGIN_DIR / "hooks").exists()
    for entry in MARKET["plugins"]:
        assert "hooks" not in entry, f"marketplace entry {entry['name']} declares hooks"


def test_the_plugin_folder_has_what_the_directory_requires():
    # The directory refuses a plugin without a README of 40 words (code blocks not counted) or
    # a license, and takes the listing icon from .claude-plugin/icon.png once, on first submit.
    readme = (PLUGIN_DIR / "README.md").read_text(encoding="utf-8")
    prose = re.sub(r"```.*?```", "", readme, flags=re.S)
    assert len(prose.split()) >= 40
    assert (PLUGIN_DIR / "LICENSE").read_text(encoding="utf-8") == (ROOT / "LICENSE").read_text(encoding="utf-8")
    assert PLUGIN["license"] == "MIT"
    png = (PLUGIN_DIR / ".claude-plugin" / "icon.png").read_bytes()
    assert png[:8] == b"\x89PNG\r\n\x1a\n"
    width, height = struct.unpack(">II", png[16:24])
    assert width == height and 512 <= width <= 2048 and len(png) < 2 * 1024 * 1024
