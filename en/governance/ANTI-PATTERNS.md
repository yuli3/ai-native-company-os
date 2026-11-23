# Anti-pattern catalog

Failure shapes that keep showing up in agent reports and behaviour. Reviewers name findings with these names, and authors fix them the way the table says. Every row comes from a real case in an agent-run company.

## Overcaution

| Name | Symptom | Fix |
|---|---|---|
| **Approval inflation** | Work that ends in a branch or draft PR is parked as "waiting for approval" | Re-grade with `AUTONOMY.md`; do grade A work now |
| **Hedge everything** | "This is a hypothesis", "not guaranteed" on nearly every sentence | Keep only the uncertainty that changes a decision |
| **Verification ritual** | File hashes, byte counts and encodings fill the report body | Move verification detail that feeds no decision to a log |
| **Documents instead of work** | The real goal (say, game quality) is unchanged; the output is reports and dashboards | Open every report with progress against the original goal. None means a stall (article 9) |
| **Rule over founder** | An old rule is used to undo the founder's latest instruction | Article 1: follow the latest instruction, propose amending the rule |
| **Endless hold** | Items end in "on hold" with no unblock condition or owner | Add the condition and owner, or turn it into one question |
| **Question flood** | Ten or more decisions in one report, none with a recommendation or default | Cut to five or fewer, each with a recommendation and a default |
| **Re-asking** | The founder is asked something they already answered | Check `settled-questions.md` and memory first; record every new answer there |
| **Founder as operator** | The founder is told to run terminal commands or click through dashboards the agent could do | Do it yourself (browser automation, API, CLI). If the founder truly must, hand over one double-clickable script, not instructions |

## Overreach

| Name | Symptom | Fix |
|---|---|---|
| **Duplicate build** | A new version of something that already has an open PR or owner | Check open PRs, branches and owner records first; extend the existing work |
| **Scope creep** | Unrequested features, refactors or dependencies ride along | Do the requested scope; leave the rest as a proposal |
| **Unverified done** | "Done" without running the gates | Attach the gate commands and results. If you could not run them, say so |
| **Static numbers as quality** | grep counts used to judge quality | State how the number was measured and its limits; judge by actually using or playing the thing |
| **Unsourced certainty** | Laws, prices and dates asserted from memory or secondary sources | Link the primary source or say "per secondary source" |
| **Ignoring decisions** | Acting against repo rules or past decisions without reading them | Read `AGENTS.md` and the relevant decision records first |
| **Disk and quota blindness** | Build caches and stale worktrees pile up until the machine stops | Delete your own build output and merged worktrees as you go |

## Finding format for reviewers

```
[fix] Approval inflation — the 4-line favicon change ends in a draft PR (grade A) but was parked as waiting.
Fix: open the draft PR this turn and link it in the report.
```
