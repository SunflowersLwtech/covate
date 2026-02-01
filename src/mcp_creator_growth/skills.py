"""
Skills Framework
================

Modular capability units for the agent.
"""

from typing import Any, Callable, Dict

class Skill:
    """
    Represents a modular skill that an agent can load and execute.
    """

    def __init__(
        self,
        name: str,
        description: str,
        func: Callable[..., Any]
    ):
        """
        Initialize a new Skill.

        Args:
            name: Unique name of the skill
            description: Description of what the skill does
            func: The callable function that implements the skill logic
        """
        self.name = name
        self.description = description
        self.func = func

    def execute(self, *args: Any, **kwargs: Any) -> Any:
        """
        Execute the skill.

        Args:
            *args: Positional arguments for the skill function
            **kwargs: Keyword arguments for the skill function

        Returns:
            The result of the skill execution
        """
        return self.func(*args, **kwargs)

    def to_dict(self) -> Dict[str, Any]:
        """
        Serialize skill metadata.

        Returns:
            Dictionary representation of the skill metadata
        """
        return {
            "name": self.name,
            "description": self.description,
            "function_name": self.func.__name__,
        }

    def __repr__(self) -> str:
        return f"<Skill: {self.name}>"
