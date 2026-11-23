# Agent-Run Company Kit

**The operating rules a one-person company used to let AI agents run the day-to-day: merging code, shipping features, publishing content, while the founder only answers one-tap questions from a phone.**

Most "AI agent" templates give you prompts. This kit gives you the governance that keeps several agents (Claude Code, Codex, Cursor, local models) productive without breaking things, distilled from running a real multi-site company with agents since autumn 2026.

## What's inside

| Folder | What |
|---|---|
| `en/governance/` | A 10-article constitution, autonomy grades (A do / B standing approval / C ask / D never), an anti-pattern catalog from real failures, a report format |
| `governance/harness/` | `check-report.mjs`: lints agent reports for missing artifacts, question floods, endless holds and stalls (English and Korean, tested) |
| `en/claude-code/` | `AGENTS.md` start-order template, `settings.example.json`, `hooks/git-guard.sh` (blocks force push, branch deletes, pushes to main; tested) |
| `en/templates/` | `settled-questions.md` (never ask twice), a memory index, a lessons file |
| `en/playbooks/operator-mode.md` | The three stages from "approve everything" to "agents operate", and the failure modes we hit |

## Quick start (15 minutes)

1. Copy this kit into a private "company brain" repo.
2. Fill in `en/claude-code/AGENTS.md` and point every code repo's `CLAUDE.md` / `AGENTS.md` at it with one line.
3. Copy `en/claude-code/settings.example.json` to `.claude/settings.json`. Test the guard: `bash en/claude-code/hooks/git-guard.test.sh`.
4. Start `settled-questions.md` and `memory/MEMORY.md` from `en/templates/`.
5. Follow `en/playbooks/operator-mode.md` stage 1 this week.

## Requirements

Node 18+ for the report checker, bash and python3 for the git guard. Works with any agent that reads `AGENTS.md` or `CLAUDE.md`.

## Tests

```bash
node --test governance/harness/check-report.test.mjs
bash en/claude-code/hooks/git-guard.test.sh
```

The Korean edition (small-business manuals, setup) is in the rest of this repository; see `README.md`.
