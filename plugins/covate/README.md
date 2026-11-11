# Covate review for Claude Code

Covate helps you learn from the code your AI assistant writes for you. This plugin brings its
spaced review: concepts you met while working (a decision, a bug cause, a rule worth
remembering) come back as short quizzes after 1, 7 and 30 days, and only your first answer to a
question counts.

- Source, documentation and issues: <https://github.com/SunflowersLwtech/covate>
- Project site: <https://covate.org>
- Privacy policy: <https://covate.org/privacy> (it covers the covate.org ledger; this README
  covers what the plugin does on your computer)

## What this plugin adds

- **The `covate-review` skill and two commands.** `/covate:review` makes a review quiz page from
  what is due and what you just learned; `/covate:review-record <page>` scores the answers into
  your review ledger and shows where things stand.

The plugin starts no server and installs no hooks. The rest of Covate (quizzes on each change,
a debugging memory, term explanations) is the Covate MCP server, which you add separately if you
want it: `/plugin install covate-mcp@covate` from the same marketplace, or see the main README.

## Install

```
/plugin marketplace add SunflowersLwtech/covate
/plugin install covate@covate
```

You need [uv](https://docs.astral.sh/uv/) installed. The review commands publish quiz pages
with the [FoldRender](https://foldrender.dev) command, so install it too.

## What runs on your computer, and what leaves it

- **What runs.** The review commands run Covate's `review` command with
  `uvx --from git+https://github.com/SunflowersLwtech/covate@<commit>`: one fixed commit of the
  repository above, written in full in the skill. None of them is pre-approved, so your
  assistant's usual permission prompt applies.
  The first run downloads that commit from GitHub and the Python packages it depends on from
  PyPI (about 100 MB, usually under a minute); uv caches them.
- **What it stores.** The review ledger (concepts, due dates, first-answer scores) is a file in
  `mcp-sidecar/global/review/` under your user configuration folder (`~/.config` on macOS and
  Linux, `%APPDATA%` on Windows). Making a quiz also leaves `questions.json` and `page.html` in
  the folder you are working in.
- **What it sends.** Covate calls no model and no service of its own: your assistant writes the
  questions. The review commands publish each quiz page with your own FoldRender account: the
  page, with its questions, goes to foldrender.dev and is private unless you share it, and
  FoldRender's privacy policy applies to it. Do not put secrets or private code in questions.
- The plugin installs no hooks, starts no server and pre-approves no shell commands.

## License

MIT. See [LICENSE](LICENSE).
