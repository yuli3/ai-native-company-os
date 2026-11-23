#!/usr/bin/env bash
# bash en/claude-code/hooks/git-guard.test.sh  -> prints FAIL lines and exits 1 on any mismatch
cd "$(dirname "$0")"
fail=0
t() { printf '{"tool_input":{"command":"%s"}}' "$2" | ./git-guard.sh >/dev/null 2>&1; got=$?; [ "$got" = "$1" ] || { echo "FAIL want $1 got $got: $2"; fail=1; }; }
t 0 "git push -u origin claude/x"
t 0 "git push --force-with-lease origin claude/fix"
t 0 "git push -u origin feature-main-page"
t 0 "git status"
t 0 "ls -f"
t 2 "git push --force origin feat"
t 2 "git push -f"
t 2 "git push origin +feat"
t 2 "git push --force-with-lease origin feat"
t 2 "git push origin --delete feat"
t 2 "git push origin :feat"
t 2 "git push origin main"
t 2 "git push origin HEAD:main"
[ $fail = 0 ] && echo "git-guard: all cases pass"
exit $fail
