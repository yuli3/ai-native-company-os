import { test } from "node:test";
import assert from "node:assert/strict";
import { checkReport, checkStall } from "./check-report.mjs";

const good = `# 이펙트 교체

## 목표 대비 진척
원래 목표: 게임 연출 품질
이번 진척: confetti 18곳 교체 draft PR

## 결정 요청
1. 질문: 머지할까요?
   선택지: A 머지 / B 보류
   추천: A, 게이트 통과
   기본값: 답이 올 때까지 대기

## 한 것
- https://github.com/acme/game/pull/19 confetti 교체
- 검증: npm test 통과

## 안 한 것
- 실기기 플레이 — 보류, 해제 조건: 폰 연결, 담당: 오너

## 다음 행동
- 에이전트: 리뷰 반영
`;

test("a report with an artifact, a well-formed question and every section passes", () => {
  const r = checkReport(good);
  assert.equal(r.ok, true, JSON.stringify(r.findings));
  assert.equal(r.findings.length, 0, JSON.stringify(r.findings));
  assert.equal(r.stats.questions, 1);
});

test("missing sections are errors", () => {
  const r = checkReport("# 보고\n\n그냥 메모\n");
  assert.equal(r.ok, false);
  assert.ok(r.findings.some((f) => f.pattern === "형식"));
});

test("no artifact and no question is the document-instead-of-work error", () => {
  const r = checkReport(good.replace(/https:\/\/github\.com\S+/, "교체함").replace(/1\. 질문:[\s\S]*?기본값: [^\n]*\n/, "없음\n"));
  assert.ok(r.findings.some((f) => f.pattern === "문서로 대체" && f.level === "error"));
});

test("many bare pending items without a question flag approval inflation", () => {
  const pending = Array.from({ length: 5 }, (_, i) => `- 항목${i} 승인 대기`).join("\n");
  const text = good.replace(/1\. 질문:[\s\S]*?기본값: [^\n]*\n/, "없음\n").replace("## 안 한 것", `## 안 한 것\n${pending}`);
  const r = checkReport(text);
  const names = r.findings.map((f) => f.pattern);
  assert.ok(names.includes("승인 인플레이션"));
  assert.ok(names.includes("무한 보류"));
});

test("questions without recommendation and default are flagged", () => {
  const r = checkReport(good.replace("   추천: A, 게이트 통과\n", "").replace("   기본값: 답이 올 때까지 대기\n", ""));
  assert.ok(r.findings.some((f) => f.pattern === "질문 형식"));
});

test("hedging density and hashes are flagged as warnings, not errors", () => {
  const hedgy = good + "\n" + "이것은 가설이지 사실이 아니며 보장하지 않습니다. 단정하지 않습니다. ".repeat(8) + "\n" + "a".repeat(64) + "\n";
  const r = checkReport(hedgy);
  assert.equal(r.ok, true);
  const names = r.findings.map((f) => f.pattern);
  assert.ok(names.includes("전면 가설화"));
  assert.ok(names.includes("검증 의례"));
});

test("two idle reports in a row are a stall; one is not", () => {
  const idle = "## 목표 대비 진척\n이번 진척: 없음\n## 결정 요청\n없음\n## 한 것\n정리\n## 다음 행동\n검토\n";
  assert.equal(checkStall([good, idle]).stalled, false);
  assert.equal(checkStall([good, idle, idle]).stalled, true);
});
