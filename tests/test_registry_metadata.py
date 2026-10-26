"""Registry metadata stays consistent across server.json, the Dockerfile and the package.

The official MCP Registry verifies an OCI package by comparing the image label
``io.modelcontextprotocol.server.name`` with ``name`` in server.json, and rejects a
submission whose package tag does not match ``version``. Those values also live in
the Dockerfile, pyproject.toml and covate.__version__, so a release that bumps one
and forgets another would publish an image the registry refuses. These tests pin
every pairing together; they read the repo files, not the installed package.
"""

import json
import re
import tomllib
from pathlib import Path

import pytest

import covate

ROOT = Path(__file__).resolve().parent.parent

SERVER_NAME = "io.github.sunflowerslwtech/covate"
IMAGE_TAG_PREFIX = "ghcr.io/sunflowerslwtech/covate:"


@pytest.fixture
def server_json():
    return json.loads((ROOT / "server.json").read_text(encoding="utf-8"))


@pytest.fixture
def dockerfile():
    return (ROOT / "Dockerfile").read_text(encoding="utf-8")


def _dockerfile_label(dockerfile: str, key: str) -> str:
    match = re.search(rf'^LABEL {re.escape(key)}="(?P<value>[^"]+)"\s*$', dockerfile, re.M)
    assert match, f"Dockerfile is missing LABEL {key}="
    return match.group("value")


def test_server_name_matches_dockerfile_ownership_label(server_json, dockerfile):
    """The registry rejects the image when its ownership label ≠ server.json name."""
    assert server_json["name"] == SERVER_NAME
    assert _dockerfile_label(dockerfile, "io.modelcontextprotocol.server.name") == SERVER_NAME


def test_server_version_matches_package_version(server_json):
    """server.json version must equal the version the image actually serves."""
    pyproject = tomllib.loads((ROOT / "pyproject.toml").read_text(encoding="utf-8"))
    assert server_json["version"] == pyproject["project"]["version"]
    assert server_json["version"] == covate.__version__


def test_oci_package_tag_matches_version(server_json):
    """The registry fetches `identifier` literally; its tag must be this version."""
    packages = server_json["packages"]
    assert len(packages) == 1, "registry entry should publish exactly one package"
    package = packages[0]
    assert package["registryType"] == "oci"
    assert package["identifier"] == f"{IMAGE_TAG_PREFIX}{server_json['version']}"
    assert package["version"] == server_json["version"]


def test_oci_package_is_stdio(server_json):
    """The image speaks stdio; a different transport would be a different entry."""
    assert server_json["packages"][0]["transport"]["type"] == "stdio"
