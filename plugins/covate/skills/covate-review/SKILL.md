---
name: covate-review
description: Spaced review of what the user learned. Use when the user wants a quiz on recent work, asks what to review today, or wants their answers from a review page scored.
---

# Covate review

Covate keeps a local ledger of concepts and when each one is due again (1, 7, then 30 days).
Only a person's **first** answer to a question counts. Covate itself never calls a model or
the network (`uvx` may download its dependencies the first time it runs).

Run every command below exactly as written, with its `uvx --from "git+https://github.com/SunflowersLwtech/covate@22f0adbffdc0d96f51cead4161d00847aba9ad9d"`
prefix. That runs the Covate commit this plugin pins, so the commands always match these steps;
a `covate` already on PATH can be an older install that has no `review`. The first run downloads
that commit from GitHub and its dependencies from PyPI, and uv caches them. If `uvx` is not
installed, tell the user to install uv and stop. Put `--ledger` / `--today` before the
subcommand.

## Make a quiz

1. `uvx --from "git+https://github.com/SunflowersLwtech/covate@22f0adbffdc0d96f51cead4161d00847aba9ad9d" covate review due --json` lists concepts due now, most overdue first.
2. Pick up to 5 of those, plus up to 3 new concepts from this session (a decision made, a bug
   cause, a rule worth remembering). A concept is a short noun phrase, at most 64 characters.
3. Write one question per concept, 2-6 options, exactly one correct. Make the wrong options
   plausible, and keep every question answerable without seeing the code.
4. Save `questions.json`:

   ```json
   {"title": "Review 2026-10-27",
    "questions": [{"concept": "Idempotency keys", "question": "...",
                   "options": ["...", "..."], "correct": 1, "explanation": "..."}]}
   ```
5. `uvx --from "git+https://github.com/SunflowersLwtech/covate@22f0adbffdc0d96f51cead4161d00847aba9ad9d" covate review page questions.json -o page.html`, then publish it with the FoldRender
   command line: `foldrender publish page.html`. Keep it private unless the user says
   otherwise, and give the user the link. If `foldrender` is not installed, say so and stop;
   do not look for another way to host it.

## Score the answers

After the user has answered on the page:

`foldrender answers <page> --json | uvx --from "git+https://github.com/SunflowersLwtech/covate@22f0adbffdc0d96f51cead4161d00847aba9ad9d" covate review record`

It prints how many first answers were scored and which were skipped and why (for example an
answer still inside FoldRender's undo window; run it again a minute later). Recording the
same answers twice changes nothing. Then show where things stand: `uvx --from "git+https://github.com/SunflowersLwtech/covate@22f0adbffdc0d96f51cead4161d00847aba9ad9d" covate review status`.

## Rules

- Never edit the ledger file by hand, and never delete it to "reset"; an unreadable ledger is
  reported as an error and left untouched on purpose.
- Do not answer the questions for the user, and do not reveal the correct option before they
  have answered.
- Do not put secrets or private code in questions: the page is hosted by FoldRender.
