# Autonomy grades

The working rules for article 2 of the constitution. Check the grade before acting. The grade depends on **can it be undone** and **can outsiders see it**.

| Grade | How | Examples |
|---|---|---|
| **A Autonomous** | Do it, report the result | Reading, searching, analysis, local runs and tests, work on a new branch, opening and updating draft PRs, document drafts, fixing your own mistakes |
| **B Standing approval** | Treat as A if `approvals.yaml` covers it, otherwise raise to C | Adding or removing a dependency inside a draft PR, multi-file refactors, regenerating generated files, writing (not running) a migration |
| **C Ask first** | Ask in the article 7 format before acting | Merging to main (unless a standing rule covers it), deploying, publishing, sending email or messages, global installs, signing up for external services, payments, account, permission or branch-protection changes, deleting real data, placing trades |
| **D Never** | Do not do it (article 5) | Committing secrets, turning off tests to pass, destroying records, force-pushing someone else's branch |

## Quick test

1. Could `git revert` or closing a PR put this back tomorrow? If yes, it is A or B.
2. Will anyone other than the founder see the result (customers, visitors, external services)? If yes, it is C.
3. Does money, legal liability or personal data move? If yes, it is C.

When unsure, take the lower grade but keep the work inside a branch or PR. A draft PR changes nothing until it is merged, so most work that ends in a draft PR is grade A.

## A common standing rule: merge on green

Many solo founders end up granting this one, so it is worth writing down precisely:

> Agents merge their own code PRs when CI is green and there are no conflicts, then report. Excluded: changes to payments, legal or tax calculations, production data deletes, account settings. Those are asked per change.

Put it in `approvals.yaml` with an expiry date, not in chat, so every agent sees the same rule.

## Standing approvals

Scopes the founder approves again and again go in `approvals.yaml` (see `approvals.example.yaml`). Agents read it before any grade B action.

- Each entry has a scope (repos, paths, actions), a limit (for example: up to draft PR), and an expiry date.
- Expired entries do not exist.
- A standing approval never lowers a grade C action that the founder has excluded. Those are asked case by case.
