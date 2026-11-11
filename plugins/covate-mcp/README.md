# Covate MCP server for Claude Code

The Covate MCP server, as a plugin: quizzes on the changes your assistant makes, a memory of
how past bugs were fixed, and term explanations in the context of your project. It is in this
repository's own marketplace only; the Covate listing in Anthropic's plugin directory holds the
review commands (`covate@covate`), because the directory accepts servers that run on your
computer only from organizations it has verified.

```
/plugin marketplace add SunflowersLwtech/covate
/plugin install covate-mcp@covate
```

You need [uv](https://docs.astral.sh/uv/). The server runs
`uvx --from git+https://github.com/SunflowersLwtech/covate@<commit>`, one fixed commit written in
full in `.mcp.json`; the first start downloads it and its Python dependencies (about 100 MB). If
`/mcp` shows covate failed on that first start, reconnect it once the download has finished.

Learning sessions, the debugging memory and terms are files in a `.mcp-sidecar` folder inside the
project you are working in; add it to that project's `.gitignore` if you do not want it
committed. The quiz page is served on `127.0.0.1` by default. Nothing is sent anywhere unless you
set up the optional covate.org sync yourself. Details: <https://github.com/SunflowersLwtech/covate>
and <https://covate.org/privacy>.

MIT. See [LICENSE](LICENSE).
