# Covate for Claude Code

Covate helps you learn from the code your AI assistant writes for you. While you work, it can
quiz you on the change just made, remember how past bugs were fixed, and explain terms in the
context of your project. Concepts you have met come back for spaced review after 1, 7 and 30
days, and only your first answer to a question counts.

The source, documentation and issue tracker are at https://github.com/SunflowersLwtech/covate.
The project site is https://covate.org.

## What this plugin adds

- **The Covate MCP server.** Tools for learning sessions (quizzes on a change, with a local web
  page to answer them), a debugging memory, and term explanations.
- **The `covate-review` skill and two commands.** `/covate:review` makes a review quiz page from
  what is due and what you just learned; `/covate:review-record <page>` scores the answers into
  your review ledger.

## Install

```
/plugin marketplace add SunflowersLwtech/covate
/plugin install covate@covate
```

You need [uv](https://docs.astral.sh/uv/) installed. The review commands publish quiz pages
with the [FoldRender](https://foldrender.dev) command, so install it too if you want to use them.

## What runs on your computer, and what leaves it

- **What runs.** The server and the review commands run with
  `uvx --from git+https://github.com/SunflowersLwtech/covate@<commit>`: one fixed commit of the
  repository above, written in full in `.mcp.json` and the skill. The first run downloads that
  commit from GitHub and the Python packages it depends on from PyPI; uv caches them.
- **What it stores.** Learning sessions, the debugging memory, terms and the review ledger are
  files on your computer, in `mcp-sidecar` under your user configuration folder
  (`~/.config` on macOS and Linux, `%APPDATA%` on Windows). The quiz page is served on
  `127.0.0.1` by default.
- **What it sends.** Nothing by default. Covate calls no model and no service of its own: your
  assistant writes the questions. Two things send data, and only when you use them:
  - The review commands publish each quiz page with your own FoldRender account. The page,
    with its questions, goes to foldrender.dev and is private unless you share it. Do not put
    secrets or private code in questions.
  - The optional sync to the covate.org learning ledger runs only when you set
    `COVATE_SYNC_URL` and `COVATE_SYNC_TOKEN` and run `python -m covate.platform_sync`
    yourself. It uploads your learning sessions to that address.
- The plugin installs no hooks and pre-approves no shell commands.

## License

MIT. See [LICENSE](LICENSE).
