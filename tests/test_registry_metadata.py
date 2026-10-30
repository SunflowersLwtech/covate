"""Registry metadata stays consistent across server.json, the Dockerfile and the package.

The official MCP Registry verifies an OCI package by comparing the image label
``io.modelcontextprotocol.server.name`` with ``name`` in server.json, and its schema
refuses a ``description`` over 100 characters and an OCI package that carries
``registryBaseUrl`` or ``version`` (the tag in ``identifier`` is the version). The
name's case matters: publishing is authorised by a case-sensitive prefix match on the
GitHub login. Those values also live in the Dockerfile, pyproject.toml and
covate.__version__, so a release that bumps one and forgets another would publish an
image the registry refuses. These tests pin every pairing together; they read the
repo files, not the installed package.
"""

import hashlib
import json
import re
import tomllib
from pathlib import Path

import pytest

import covate

ROOT = Path(__file__).resolve().parent.parent

SERVER_NAME = "io.github.SunflowersLwtech/covate"
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


def test_description_fits_the_registry_limit(server_json):
    """The registry schema caps `description` at 100 characters."""
    assert 0 < len(server_json["description"]) <= 100


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
    # The registry's validator refuses both fields on an OCI package.
    assert "version" not in package
    assert "registryBaseUrl" not in package


def test_oci_package_is_stdio(server_json):
    """The image speaks stdio; a different transport would be a different entry."""
    assert server_json["packages"][0]["transport"]["type"] == "stdio"


# The icons the registry shows, pinned: covate.org's mark (assets/favicon.png, the
# README logo) at each size server.json lists. 512 is byte-for-byte the icon covate.org
# serves (platform/app/icon.png); the others are that master scaled down. Regenerate
# from the master and update a hash together; the old infinity mark, a placeholder or
# another product's logo fails here. assets/icon.png keeps its path because the entry
# already published (1.2.0) reads it from main.
REGISTRY_ICONS = {
    "assets/icon.png": (1024, "6620df92c42f96079d8f2787f1fec6a39afabdc2e6c0161302cd5f4be57fb9ef"),
    "assets/icons/covate-512.png": (512, "c380a80796aa399a5228f2c0e7e7afb051b1633593b2876d16addc33d177b204"),
    "assets/icons/covate-192.png": (192, "c74e2f83d92d8e66474e8108db21b19432b15e786269dcac979bf74e78f60763"),
    "assets/icons/covate-96.png": (96, "4b41c4025fcf8e433a9f8550b8e23120081ebd66616b29325947397572380252"),
    "assets/icons/covate-48.png": (48, "f18735c2fc86af1272b839d8cceec70650fbf6e4726ef307638233db840ea126"),
}
ICON_URL_PREFIX = "https://raw.githubusercontent.com/SunflowersLwtech/covate/main/"


def _png_size(data: bytes) -> tuple[int, int]:
    assert data[:8] == b"\x89PNG\r\n\x1a\n", "not a PNG file"
    return int.from_bytes(data[16:20], "big"), int.from_bytes(data[20:24], "big")


def test_registry_icons_are_covate_marks_at_their_declared_sizes(server_json):
    """Every icon server.json lists is a repo file, the size it says, and covate.org's mark."""
    listed = {}
    for icon in server_json["icons"]:
        assert icon["src"].startswith(ICON_URL_PREFIX), icon["src"]
        path = icon["src"][len(ICON_URL_PREFIX):]
        assert icon["mimeType"] == "image/png"
        listed[path] = icon["sizes"]
    assert set(listed) == set(REGISTRY_ICONS), "server.json and the pinned icon set disagree"
    for path, (edge, digest) in REGISTRY_ICONS.items():
        data = (ROOT / path).read_bytes()
        assert _png_size(data) == (edge, edge), f"{path} is not {edge}×{edge}"
        assert listed[path] == [f"{edge}x{edge}"], f"{path} declares {listed[path]}"
        assert hashlib.sha256(data).hexdigest() == digest, f"{path} is not covate.org's mark"


def test_registry_512_icon_is_the_one_covate_org_serves():
    assert (ROOT / "assets/icons/covate-512.png").read_bytes() == (ROOT / "platform/app/icon.png").read_bytes()
