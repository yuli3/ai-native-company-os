# Report and handoff format

The standard shape for any report an agent leaves for the founder or another agent. `governance/harness/check-report.mjs` checks it (English and Korean headings both work).

Keep the body to one screen (about 3,000 characters). Move evidence, logs and raw tables to links or an appendix.

```markdown
# (Task name)

## Progress
Objective: (one line)
This round: (one line; "none" and why if nothing moved)

## Decisions
1. Question: …
   Options: A / B
   Recommend: A, one-line reason
   Default: if no answer, proceed with A

## What I did
- (artifact link: PR, commit, file path) and one line
- Verified: the command you ran and its result

## Not done
- (item) — reason, unblocks when …, owner: …

## Could not check
- (item) — why

## Next
- (who) (what)
```

If there are no decisions, write "None" under the heading. Do not delete the heading.

Run the check:

```bash
node governance/harness/check-report.mjs reports/2026-11-24-*.md
node governance/harness/check-report.mjs --stall reports/a.md reports/b.md
```
