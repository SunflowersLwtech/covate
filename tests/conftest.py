"""Shared fixtures for the MCP server tests.

Every test talks to the server in-process through fastmcp's in-memory client, and
every file the server writes lands under pytest's tmp_path: the project directory
passed to the tools, and the global config dir (XDG_CONFIG_HOME / APPDATA).
"""

import pytest
from fastmcp import Client

import covate.config
from covate.server import mcp


@pytest.fixture(autouse=True)
def isolated_config(tmp_path, monkeypatch):
    """Point the global config/storage dir at a temp dir and drop the cached config."""
    config_home = tmp_path / "config-home"
    config_home.mkdir()
    monkeypatch.setenv("XDG_CONFIG_HOME", str(config_home))
    monkeypatch.setenv("APPDATA", str(config_home))
    monkeypatch.setattr(covate.config, "_config", None)
    return config_home


@pytest.fixture
def project_dir(tmp_path):
    project = tmp_path / "project"
    project.mkdir()
    return str(project)


@pytest.fixture
async def client():
    async with Client(mcp) as c:
        yield c
