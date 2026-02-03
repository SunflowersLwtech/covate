"""
Skills Framework
================

Defines the modular `Skill` interface for agent capabilities.
"""

from dataclasses import dataclass
from typing import Any, Callable


@dataclass
class Skill:
    """
    Represents a modular capability for an agent.

    Attributes:
        name: Unique identifier for the skill (e.g., 'code_review')
        description: Human-readable description of what the skill does
        func: The callable implementation of the skill
    """
    name: str
    description: str
    func: Callable[..., Any]

    def execute(self, *args: Any, **kwargs: Any) -> Any:
        """Execute the skill function."""
        return self.func(*args, **kwargs)
