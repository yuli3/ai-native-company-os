# 에이전트 거버넌스

여러 AI 에이전트가 한 회사의 일을 나눠 할 때 쓰는 공통 규칙과 검사 도구입니다.

| 파일 | 내용 |
|---|---|
| `CONSTITUTION.md` | 최상위 규칙 10조. 의사 우선순위, 가역성 원칙, 진척 의무, 교차 검토, 정체 감지 |
| `AUTONOMY.md` | 행동별 자율 등급(A 자율 / B 상시 승인 / C 사전 승인 / D 금지) |
| `approvals.example.yaml` | 오너가 반복 승인하는 범위를 적는 상시 승인 목록 예시 |
| `ANTI-PATTERNS.md` | 과잉 신중·과잉 적극 실패 유형과 교정 방법 |
| `REPORT-FORMAT.md` | 보고·인계 표준 형식 |
| `harness/check-report.mjs` | 보고서가 형식과 진척 의무를 지키는지 검사하는 스크립트 |

## 도입 순서

1. **헌법을 각 런타임 진입 문서에 연결합니다.** 루트 `AGENTS.md`(Codex·Cursor·Grok 등)와 `CLAUDE.md` 맨 위에 한 줄을 넣습니다.
   ```
   모든 판단은 governance/CONSTITUTION.md를 따른다. 행동 전 AUTONOMY.md로 등급을 확인하고, 보고는 REPORT-FORMAT.md 형식으로 쓴다.
   ```
   저장소별 규칙은 지우지 않습니다. 헌법과 충돌하는 조항만 고칩니다.
2. **상시 승인 목록을 만듭니다.** `approvals.example.yaml`을 복사해 `approvals.yaml`로 두고, 오너가 지금 반복해서 승인하는 일을 적습니다. 처음에는 "draft PR까지" 범위로 시작하는 것을 권합니다.
3. **보고서 검사를 붙입니다.** 에이전트 보고서를 모아 두는 폴더가 있다면, 커밋 전에 검사합니다.
   ```bash
   node governance/harness/check-report.mjs reports/2026-10-23-*.md
   node governance/harness/check-report.mjs --stall reports/a.md reports/b.md   # 정체 감지
   ```
   - Claude Code: `.claude/settings.json`의 `Stop` 훅에서 마지막 보고 파일을 검사하게 할 수 있습니다.
   - Codex: 루트 `AGENTS.md`에 "보고서를 쓴 뒤 check-report를 실행하고 FAIL이면 고친다"를 넣습니다.
   - CI: 보고서 폴더가 바뀌는 PR에서 같은 명령을 돌립니다.
4. **검토자는 `ANTI-PATTERNS.md`의 이름으로 지적합니다.** 이름이 같으면 교정 방법도 같아서, 에이전트끼리 같은 실수를 반복하지 않습니다.

## 검사 도구가 하는 일과 못 하는 일

`check-report.mjs`는 보고서의 **모양**을 봅니다. 산출물 링크가 있는지, 결정 요청에 추천과 기본값이 있는지, 해제 조건 없는 보류가 쌓였는지, 유보 표현과 해시가 본문을 채우는지를 셉니다. 작업이 옳았는지는 판단하지 못합니다. 그건 검증 게이트(테스트·빌드)와 사람의 검토가 합니다.

오류(error)는 형식 누락, 산출물도 질문도 없는 보고, 해제 조건 없는 보류의 누적입니다. 나머지는 경고(warn)입니다. 기준값은 `LIMITS`에서 조정합니다.

## 테스트

```bash
node --test governance/harness/check-report.test.mjs
```
