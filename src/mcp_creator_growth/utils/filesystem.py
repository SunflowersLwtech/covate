"""
Filesystem Utilities
====================

Common filesystem operations.
"""

import os


def ensure_project_directory(project_directory: str = ".") -> str:
    """
    Ensure the project directory exists and return its absolute path.
    If the path does not exist, falls back to the current working directory.

    Args:
        project_directory: The path to check. Defaults to "." (current directory).

    Returns:
        The absolute path to the valid project directory.
    """
    if not os.path.exists(project_directory):
        project_directory = os.getcwd()
    return os.path.abspath(project_directory)
