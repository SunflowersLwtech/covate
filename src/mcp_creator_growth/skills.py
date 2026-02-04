"""
Skills Interface
================

Defines the contract for modular capabilities (Skills) that can be registered
with the MCP server. This enables a plugin-like architecture for future expansion.
"""

from typing import Any, Dict, Protocol, runtime_checkable


@runtime_checkable
class Skill(Protocol):
    """
    Protocol defining the interface for a modular skill.
    """

    @property
    def name(self) -> str:
        """The unique name of the skill (e.g., 'debug_search')."""
        ...

    @property
    def description(self) -> str:
        """Description of what the skill does."""
        ...

    async def execute(self, **kwargs: Any) -> Any:
        """
        Execute the skill logic.

        Args:
            **kwargs: Arguments passed from the MCP tool call.

        Returns:
            Result dictionary or value.
        """
        ...


class SkillRegistry:
    """
    Registry for managing available skills.
    """

    def __init__(self) -> None:
        self._skills: Dict[str, Skill] = {}

    def register(self, skill: Skill) -> None:
        """Register a new skill."""
        if skill.name in self._skills:
            raise ValueError(f"Skill '{skill.name}' is already registered.")
        self._skills[skill.name] = skill

    def get_skill(self, name: str) -> Skill | None:
        """Retrieve a skill by name."""
        return self._skills.get(name)

    def list_skills(self) -> list[dict[str, str]]:
        """List all registered skills."""
        return [
            {"name": s.name, "description": s.description}
            for s in self._skills.values()
        ]
