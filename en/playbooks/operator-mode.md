# Operator mode: letting agents run the company

How one founder moved from "approve everything" to "agents operate, founder decides" over six weeks, and the rules that made it safe. Use it in order; each stage assumes the one before works.

## Stage 1 — Agents ship drafts (week 1)

- Everything ends in a draft PR or a draft document. Nothing merges or publishes without the founder.
- Wire `hooks/git-guard.sh` so no agent can force-push, delete branches or push to main.
- Start `settled-questions.md` on day one. Every answer goes in.

**Move on when:** the founder has stopped finding mistakes in most draft PRs.

## Stage 2 — Merge on green (weeks 2–3)

- Add the standing rule to `approvals.yaml`: agents merge their own code PRs when CI is green and conflict-free, and report after.
- Carve out what still needs the founder per change: payments, legal or tax calculations, production deletes, account settings.
- Reports shrink to results and decisions. Use `REPORT-FORMAT.md` and run the checker.

**Move on when:** a week passes with no merge the founder had to revert.

## Stage 3 — Agents operate (week 4 on)

- The founder states goals ("maximise revenue", "ten new games this month"), not tasks.
- Agents pick the work, keep a visible checklist, and report only results, blockers and questions.
- Dashboard work (analytics, DNS, ad settings) is done by the agent through browser automation, not handed to the founder. Account settings that move money still get asked per action.
- A weekly review (think tank) re-ranks goals from data and proposes the next ten jobs.

## What the founder keeps forever

- Signing up for anything in their own name, payout and tax details
- Anything legally binding: contracts, contest submissions, public statements
- Spending money
- Changing these rules

## Failure modes we hit, and the fix

| What happened | Fix |
|---|---|
| Ten-question reports the founder could not answer from a phone | One-tap cards: one question, 2–4 options, one recommended |
| Agents re-asked settled questions after a context reset | `settled-questions.md` + memory index read at session start |
| Two agents built the same feature | Check open PRs and owner records before starting |
| Reports became the product ("documents instead of work") | First line of every report = progress against the original goal |
| A shared build machine ran out of disk | Each agent cleans its own caches and worktrees |
| Old dashboards drifted from reality | Retire any dashboard nobody reads; agents work from the repo, not a mirror |
