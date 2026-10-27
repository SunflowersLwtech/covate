"""
MCP Learning Sidecar entry point.

`covate` starts the MCP server; `covate review ...` is the review command line.
"""

import sys


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "review":
        from .review.cli import main as review_main

        sys.exit(review_main(sys.argv[2:]))

    from .server import main as server_main

    server_main()


if __name__ == "__main__":
    main()
