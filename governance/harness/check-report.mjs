#!/usr/bin/env node
// Lints an agent report against governance/REPORT-FORMAT.md and the patterns in
// ANTI-PATTERNS.md. It cannot judge whether the work was right; it catches the
// shapes of a report that usually mean the work did not move: no artifact, no
// decision request, pending items without an unblock condition, hedging and
// verification ritual crowding out the content.
//
// usage:
//   node governance/harness/check-report.mjs report.md [more.md ...]
//   node governance/harness/check-report.mjs --stall older.md newer.md
//   node governance/harness/check-report.mjs --json report.md
// exit code: 1 if any report has an error, else 0.

import { readFileSync } from "node:fs";

export const LIMITS = {
  maxChars: 6000,
  maxQuestions: 5,
  maxPendingWithoutAsk: 3,
  hedgesPer1k: 2.5,
  maxHashes: 0,
};

const REQUIRED_SECTIONS = [
  { id: "progress", label: "목표 대비 진척", re: /^#{2,3}\s*(목표 대비 진척|progress)/im },
  { id: "decisions", label: "결정 요청", re: /^#{2,3}\s*(결정 요청|decisions?)/im },
  { id: "done", label: "한 것", re: /^#{2,3}\s*(한 것|done)/im },
  { id: "next", label: "다음 행동", re: /^#{2,3}\s*(다음 행동|next)/im },
];

const ARTIFACT_RE = /(https:\/\/github\.com\/[^\s)]+\/(pull|commit)\/[\w]+|\b[0-9a-f]{7,12}\b(?![0-9a-f])|`[\w./-]+\.(ts|tsx|js|mjs|md|json|astro|py)`|\bPR\s?#\d+)/gi;
const PENDING_RE = /(승인\s?대기|결재\s?대기|보류|미실행|미구현|not_collected|pending approval|on hold)/gi;
const UNBLOCK_RE = /(해제 조건|담당|unblock|owner:|→)/i;
const HEDGE_RE = /(가설이지|가설입니다|보장하지 않|단정하지 않|단정 금지|미검증|별개(다|이며|입니다)|아님\b|일반화(는|하지) 않|인증하지 않|등식이 아니)/g;
const HASH_RE = /\b[0-9a-f]{64}\b/gi;
const QUESTION_RE = /^\s*(\d+\.|-)\s*질문\s*[:：]/gim;
const RECOMMEND_RE = /추천\s*[:：]/g;
const DEFAULT_RE = /기본값\s*[:：]/g;

function count(text, re) {
  return (text.match(re) ?? []).length;
}

function section(text, re) {
  const m = re.exec(text);
  if (!m) return "";
  const rest = text.slice(m.index + m[0].length);
  const next = rest.search(/^#{1,3}\s/m);
  return next === -1 ? rest : rest.slice(0, next);
}

export function checkReport(text, limits = LIMITS) {
  const findings = [];
  const add = (level, pattern, message) => findings.push({ level, pattern, message });

  for (const s of REQUIRED_SECTIONS) {
    if (!s.re.test(text)) add("error", "형식", `"${s.label}" 절이 없습니다. 내용이 없으면 "없음"이라고 씁니다.`);
  }

  const artifacts = count(text, ARTIFACT_RE);
  const questions = count(text, QUESTION_RE);
  const progress = section(text, REQUIRED_SECTIONS[0].re);
  const noProgress = /이번 진척\s*[:：]\s*(없음|none)/i.test(progress);

  if (artifacts === 0 && questions === 0) {
    add("error", "문서로 대체", "산출물 링크(PR·커밋·파일)도 결정 요청도 없습니다. 헌법 제3조.");
  }
  if (noProgress && questions === 0) {
    add("warn", "정체", "이번 진척이 없는데 결정 요청도 없습니다. 질문 하나로 바꾸십시오(헌법 제9조).");
  }

  if (questions > limits.maxQuestions) {
    add("warn", "질문 홍수", `결정 요청이 ${questions}개입니다. ${limits.maxQuestions}개 이하로 줄이고 나머지는 기본값으로 처리합니다.`);
  }
  if (questions > 0) {
    const recs = count(text, RECOMMEND_RE);
    const defs = count(text, DEFAULT_RE);
    if (recs < questions || defs < questions) {
      add("warn", "질문 형식", `질문 ${questions}개 중 추천 ${recs}개, 기본값 ${defs}개입니다. 질문마다 둘 다 붙입니다(헌법 제7조).`);
    }
  }

  // Option lists inside a decision request ("선택지: A / B 보류") are choices, not pending work.
  const pendingOne = new RegExp(PENDING_RE.source, "i");
  const pendingLines = text.split("\n").filter((line) => pendingOne.test(line) && !/^#/.test(line) && !/선택지\s*[:：]/.test(line));
  const unblocked = pendingLines.filter((line) => UNBLOCK_RE.test(line)).length;
  const bare = pendingLines.length - unblocked;
  if (bare > 0) {
    add(bare > limits.maxPendingWithoutAsk && questions === 0 ? "error" : "warn", "무한 보류",
      `해제 조건이나 담당이 없는 보류 항목이 ${bare}줄 있습니다.`);
  }
  if (pendingLines.length > limits.maxPendingWithoutAsk && questions === 0) {
    add("warn", "승인 인플레이션", `보류·대기 항목이 ${pendingLines.length}개인데 결정 요청이 없습니다. A등급(draft PR로 끝나는 일)은 바로 실행합니다.`);
  }

  const hedges = count(text, HEDGE_RE);
  const per1k = (hedges / Math.max(1, text.length)) * 1000;
  if (per1k > limits.hedgesPer1k) {
    add("warn", "전면 가설화", `유보 표현이 1,000자당 ${per1k.toFixed(1)}회입니다(기준 ${limits.hedgesPer1k}). 결정을 바꾸는 불확실성만 남깁니다.`);
  }

  const hashes = count(text, HASH_RE);
  if (hashes > limits.maxHashes) {
    add("warn", "검증 의례", `본문에 해시가 ${hashes}개 있습니다. 결정에 쓰이지 않으면 로그로 옮깁니다.`);
  }

  if (text.length > limits.maxChars) {
    add("warn", "분량", `본문이 ${text.length.toLocaleString()}자입니다(기준 ${limits.maxChars.toLocaleString()}자). 근거는 링크나 부록으로 뺍니다.`);
  }

  return {
    ok: !findings.some((f) => f.level === "error"),
    stats: { chars: text.length, artifacts, questions, pending: pendingLines.length, hedges, hashes },
    findings,
  };
}

/** Two consecutive reports on one objective with no artifact and no question = stall. */
export function checkStall(reports) {
  const idle = reports.map((text) => {
    const r = checkReport(text);
    return r.stats.artifacts === 0 && r.stats.questions === 0;
  });
  for (let i = 1; i < idle.length; i += 1) {
    if (idle[i - 1] && idle[i]) return { stalled: true, at: i };
  }
  return { stalled: false };
}

function main(argv) {
  const json = argv.includes("--json");
  const stall = argv.includes("--stall");
  const files = argv.filter((a) => !a.startsWith("--"));
  if (files.length === 0) {
    console.error("usage: check-report.mjs [--json] [--stall] report.md [...]");
    return 2;
  }
  const texts = files.map((f) => readFileSync(f, "utf8"));
  if (stall) {
    const result = checkStall(texts);
    console.log(result.stalled ? `정체: ${files[result.at - 1]} → ${files[result.at]} 연속으로 산출물·결정 요청 없음` : "정체 없음");
    return result.stalled ? 1 : 0;
  }
  let failed = false;
  const out = files.map((file, i) => {
    const result = checkReport(texts[i]);
    if (!result.ok) failed = true;
    return { file, ...result };
  });
  if (json) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    for (const r of out) {
      console.log(`${r.ok ? "PASS" : "FAIL"} ${r.file}  (${r.stats.chars}자, 산출물 ${r.stats.artifacts}, 질문 ${r.stats.questions}, 보류 ${r.stats.pending})`);
      for (const f of r.findings) console.log(`  [${f.level}] ${f.pattern}: ${f.message}`);
    }
  }
  return failed ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) process.exit(main(process.argv.slice(2)));
