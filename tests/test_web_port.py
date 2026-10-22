"""Which port the quiz page's local server listens on.

The port comes from [server] port in config.toml or MCP_SIDECAR_SERVER_PORT; 0 means
the first free one from 8765. A port that is already taken (another covate, another
program) is skipped instead of failing the session.
"""

import socket
import time

import httpx
import pytest

from covate.web.main import WebUIManager


def _free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def _wait_healthy(manager: WebUIManager) -> dict:
    deadline = time.monotonic() + 15
    while True:
        try:
            return httpx.get(f"{manager.get_server_url()}/health", timeout=2).json()
        except httpx.TransportError:
            if time.monotonic() > deadline:
                raise
            time.sleep(0.1)


@pytest.fixture
def started():
    managers: list[WebUIManager] = []

    def start(**kwargs) -> WebUIManager:
        manager = WebUIManager(**kwargs)
        managers.append(manager)
        manager.start_server()
        return manager

    yield start
    for manager in managers:
        manager.stop_server()
        if manager.server_thread:
            manager.server_thread.join(timeout=5)


def test_uses_the_configured_port(started, monkeypatch):
    port = _free_port()
    monkeypatch.setenv("MCP_SIDECAR_SERVER_PORT", str(port))
    manager = started()
    assert manager.port == port
    assert _wait_healthy(manager)["status"] == "healthy"


def test_moves_off_a_configured_port_that_is_taken(started, monkeypatch):
    with socket.socket() as squatter:
        squatter.bind(("127.0.0.1", 0))
        squatter.listen()
        taken = squatter.getsockname()[1]
        monkeypatch.setenv("MCP_SIDECAR_SERVER_PORT", str(taken))

        manager = started()
        assert manager.port != taken
        assert _wait_healthy(manager)["status"] == "healthy"


def test_two_servers_at_once_get_different_ports(started):
    first, second = started(), started()
    assert first.port != second.port
    assert _wait_healthy(first)["status"] == "healthy"
    assert _wait_healthy(second)["status"] == "healthy"


def test_default_is_8765_or_the_next_free_one(started):
    manager = started()
    assert manager.port in WebUIManager.DEFAULT_PORTS
    assert _wait_healthy(manager)["status"] == "healthy"
