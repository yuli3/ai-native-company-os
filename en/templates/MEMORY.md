# Memory index

One line per memory file in this folder. Agents read this index at the start of every session and open only the files that match the task. Keep the index under about 200 lines; summarise or prune when it grows.

Each memory file holds one subject and starts with front matter:

```markdown
---
name: kebab-case-slug
description: one line used to decide relevance
type: founder | feedback | project | reference
---
The fact. For feedback and project: **Why:** and **How to apply:** lines.
```

- `founder`: who the founder is, how they want to work
- `feedback`: corrections and confirmed approaches, with the reason
- `project`: ongoing work, goals, constraints not visible in the code (absolute dates)
- `reference`: where things live (dashboards, accounts, URLs; never secrets)

## Founder & working rules
- [[founder-profile]] language, device, one-tap choices

## Projects
- [[project-example-2026-11-24]] (one line on state and next step)

## Lessons
- [[lessons]] things learned the hard way
