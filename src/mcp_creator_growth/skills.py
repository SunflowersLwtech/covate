"""
Skills Protocol
===============

Defines the interface for modular agent skills.
"""

from typing import Any, Protocol, runtime_checkable

@runtime_checkable
class Skill(Protocol):
    """
    Protocol for a modular skill that can be executed by an agent.
    """

    @property
    def name(self) -> str:
        """The name of the skill."""
        ...

    @property
    def description(self) -> str:
        """A description of what the skill does."""
        ...

    async def execute(self, **kwargs: Any) -> Any:
        """
        Execute the skill.

        Args:
            **kwargs: Arguments required by the skill.

        Returns:
            The result of the execution.
        """
        ...
