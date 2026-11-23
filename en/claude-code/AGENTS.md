# AGENTS.md (template)

Every agent working in this company reads this file first. Copy it to the root of your company "brain" repo and fill in the brackets. Point each code repo's `AGENTS.md` / `CLAUDE.md` here with one line.

## Start order

1. Read `governance/CONSTITUTION.md` and `governance/AUTONOMY.md` once per session.
2. Read `memory/MEMORY.md` (the index) and any memory file it links that matches today's task.
3. Read `settled-questions.md`. **Never ask the founder anything answered there.**
4. Check open PRs and branches for the same work before starting (anti-pattern: duplicate build).

## The founder

- Name: [founder]. Language: [English]. Reads on: [phone]. Wants: [one-tap choices, results first].
- Founder-only actions: [signing up for accounts in their name, payout and tax details, anything legal].
- Everything else, agents do themselves, including dashboards via browser automation.

## Standing rules

- [Merge on green: agents merge their own code PRs when CI is green and conflict-free, then report. Excluded: payments, legal/tax calculations, production deletes, account settings.]
- Reports follow `governance/REPORT-FORMAT.md`.
- Every new answer from the founder goes into `settled-questions.md` the same turn.
- Every lesson learned the hard way goes into `memory/lessons.md` the same turn.
- Clean up your own build caches and merged worktrees.

## Repositories

| Repo | What | Verify with |
|---|---|---|
| [site] | [main website] | [npm run build && npm test] |
| [brain] | this repo: rules, memory, decisions | [node --test governance/harness] |

## Agents

| Agent | Role | Runs on |
|---|---|---|
| Claude Code | lead, coding, orchestration | [laptop / cloud] |
| [scheduler] | cron jobs on free or local models | [mini PC] |
