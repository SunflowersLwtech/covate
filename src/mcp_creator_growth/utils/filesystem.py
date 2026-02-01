"""
Filesystem Utilities
====================

Common filesystem operations.
"""

import os


def ensure_project_directory(project_directory: str = ".") -> str:
    """
    Ensure the project directory exists and return its absolute path.
    If the path does not exist, defaults to current working directory.

    Args:
        project_directory: The path to check

    Returns:
        Absolute path to a valid directory
    """
    if not os.path.exists(project_directory):
        project_directory = os.getcwd()
    return os.path.abspath(project_directory)
