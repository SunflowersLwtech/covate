"""
Filesystem Utilities
====================

Common filesystem operations for the MCP server.
"""

import os


def ensure_project_directory(project_directory: str) -> str:
    """
    Ensure the project directory exists and return its absolute path.
    If the directory does not exist, defaults to the current working directory.

    Args:
        project_directory: The path to the project directory.

    Returns:
        The absolute path to the project directory.
    """
    if not os.path.exists(project_directory):
        project_directory = os.getcwd()
    return os.path.abspath(project_directory)
