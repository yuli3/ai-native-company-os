#!/usr/bin/env bash
# Claude Code PreToolUse hook for Bash. Lets agents push their own work, but blocks the
# git operations that destroy history or other people's work:
#   force push (--force, -f, --force-with-lease is allowed only to claude/* or agent/* branches),
#   deleting remote branches, pushing straight to main/master, hard resets of main.
# Exit code 2 blocks the call and shows the reason to the agent.
#
# Wire it in .claude/settings.json (see settings.example.json).
set -euo pipefail

input="$(cat)"
cmd="$(printf '%s' "$input" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null || true)"
[ -z "$cmd" ] && exit 0

block() { echo "git-guard: $1" >&2; exit 2; }

# Only look at git commands.
printf '%s' "$cmd" | grep -Eq '(^|[;&|[:space:]])git[[:space:]]' || exit 0

if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push[^;&|]*(--force([[:space:]]|$)|[[:space:]]-f([[:space:]]|$)|[[:space:]]\+[A-Za-z0-9_./-]+)'; then
  block "force push is blocked. Merge the remote branch instead (git fetch && git merge)."
fi
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push[^;&|]*--force-with-lease'; then
  printf '%s' "$cmd" | grep -Eq '(claude|agent)/[A-Za-z0-9_./-]+' || block "--force-with-lease is allowed only on claude/* or agent/* branches."
fi
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push[^;&|]*([[:space:]]--delete|[[:space:]]-d[[:space:]]|[[:space:]]:[A-Za-z0-9_./-]+)'; then
  block "deleting remote branches is blocked. Ask the founder."
fi
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push[^;&|]*[[:space:]](origin[[:space:]]+)?(HEAD:)?(main|master)([[:space:]]|$)'; then
  block "pushing straight to main is blocked. Push a branch and open a PR."
fi
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+reset[[:space:]]+--hard[[:space:]]+origin/(main|master)' && \
   printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+checkout[[:space:]]+(main|master)'; then
  block "hard reset of main is blocked."
fi
exit 0
