// The core: pure readers of files, no editor import, so unit tests and the measures run without the editor.
// It keeps no state: every function takes text and returns a value.

import * as posix from "node:path/posix";

// ---------- topics ----------

export interface Topic {
  path: string;
  title: string;
  summary: string;
  parent: string | null;
}

function globToRegExp(glob: string): RegExp {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`);
}

/** As the topic check's matches_any: a pattern ending in "/" covers a folder; others are globs where * crosses "/". */
export function matchesAny(path: string, patterns: string[]): boolean {
  return patterns.some((p) => (p.endsWith("/") ? path === p.slice(0, -1) || path.startsWith(p) : globToRegExp(p).test(path)));
}

/** The README.md of the nearest folder above that is a topic; for a README.md, above its own folder. */
export function containing(path: string, topics: Set<string>): string | null {
  let folder = posix.dirname(path);
  if (folder === ".") folder = "";
  if (posix.basename(path) === "README.md") {
    if (!folder) return null;
    folder = posix.dirname(folder);
    if (folder === ".") folder = "";
  }
  for (;;) {
    const candidate = folder ? `${folder}/README.md` : "README.md";
    if (topics.has(candidate) && candidate !== path) return candidate;
    if (!folder) return null;
    folder = posix.dirname(folder);
    if (folder === ".") folder = "";
  }
}

/** Title: the first "# " heading outside a code fence. Summary: the first paragraph after it, labels dropped. */
export function titleAndSummary(text: string): { title: string; summary: string } {
  let fence = false;
  let title = "";
  const para: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue; }
    if (fence) continue;
    if (!title) {
      const m = /^# (.+?)\s*$/.exec(line);
      if (m) title = m[1];
      continue;
    }
    const plain = line.trim();
    if (!plain || /^(#|!\[|\[!\[|<|\|)/.test(plain)) {
      if (para.length) break;
      continue;
    }
    para.push(plain.replace(/^>\s*/, ""));
  }
  const summary = para.join(" ").replace(/^\*\*[A-Za-z ]+[.:]\*\*\s*/, "");
  return { title, summary };
}

/** The topics among the given workspace-relative paths, each with its parent by the topic check's rule. */
export function readTopics(paths: string[], read: (p: string) => string, patterns: string[]): Topic[] {
  const set = new Set(paths.filter((p) => p.endsWith(".md") && matchesAny(p, patterns)));
  return [...set].sort().map((path) => {
    const { title, summary } = titleAndSummary(read(path));
    return { path, title: title || path, summary, parent: containing(path, set) };
  });
}

/** The parent and child pairs the tree draws, as "parent>child", sorted. The root has no pair. */
export function pairs(topics: Topic[]): string[] {
  return topics.filter((t) => t.parent).map((t) => `${t.parent}>${t.path}`).sort();
}

// ---------- verdicts ----------

export type Kind = "error" | "warning" | "judgment";

export interface Verdict {
  kind: Kind;
  check: string;
  path: string;
  line: number | null;
  message: string;
  raw: string;
}

// The runner prints: kind padded to 8, check padded to 20, "path:line", two spaces, the message.
const VERDICT = /^(error|warning|judgment)\s+(\S+)\s+(\S+?)(?::(\d+))?\s{2,}(.*)$/;

export function parseVerdicts(text: string): Verdict[] {
  const out: Verdict[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const m = VERDICT.exec(raw);
    if (!m) continue; // summary, notice and blank lines are not verdicts
    out.push({ kind: m[1] as Kind, check: m[2], path: m[3], line: m[4] ? Number(m[4]) : null, message: m[5], raw });
  }
  return out;
}

export interface Placement {
  verdict: Verdict;
  path: string;
  line: number; // 1-based
}

/** Errors and warnings placed as diagnostics: a missing line sits on line 1; a missing file sits on the root topic. */
export function place(verdicts: Verdict[], exists: (p: string) => boolean, rootTopic: string): Placement[] {
  return verdicts
    .filter((v) => v.kind !== "judgment")
    .map((v) => ({ verdict: v, path: exists(v.path) ? v.path : rootTopic, line: v.line ?? 1 }));
}

export function worstKind(verdicts: Verdict[], path: string): Kind | null {
  const mine = verdicts.filter((v) => v.path === path);
  if (mine.some((v) => v.kind === "error")) return "error";
  if (mine.some((v) => v.kind === "warning")) return "warning";
  return null;
}

// ---------- judgments ----------

export interface Question {
  check: string;
  path: string;
  question: string;
  answer: string;
  line: number; // 1-based line of the [[answer]] header
}

function unquote(value: string): string {
  const v = value.trim();
  if (v.startsWith('"') && v.endsWith('"')) {
    return v.slice(1, -1).replace(/\\(["\\nt])/g, (_, c) => ({ '"': '"', "\\": "\\", n: "\n", t: "\t" } as Record<string, string>)[c]);
  }
  return v;
}

/** The [[answer]] tables of a judgments file: only the subset the runner writes (string keys on one line). */
export function parseJudgments(text: string): Question[] {
  const out: Question[] = [];
  let current: Question | null = null;
  text.split(/\r?\n/).forEach((line, i) => {
    if (line.trim() === "[[answer]]") {
      current = { check: "", path: "", question: "", answer: "", line: i + 1 };
      out.push(current);
      return;
    }
    const m = /^(\w+)\s*=\s*(.*)$/.exec(line);
    if (current && m && (m[1] === "check" || m[1] === "path" || m[1] === "question" || m[1] === "answer")) {
      current[m[1]] = unquote(m[2]);
    }
  });
  return out;
}

export function openQuestions(all: Question[]): Question[] {
  return all.filter((q) => q.answer.trim() === "");
}

// ---------- hand-over note ----------

export interface HandoverInput {
  startFile: string;
  memoryIndex: string;
  verdicts: Verdict[];
  decisionLog: string;
  logLines: number;
}

/** The note names the originals by path and copies none of them. Failed checks are the runner's lines, verbatim. */
export function handoverNote(i: HandoverInput): string {
  const failed = i.verdicts.filter((v) => v.kind === "error");
  const tail = i.decisionLog.split(/\r?\n/).filter((l) => l.trim()).slice(-i.logLines);
  return [
    "# Hand-over note",
    "",
    "Derived and disposable. Read these two files first, in full:",
    "",
    `- ${i.startFile}`,
    `- ${i.memoryIndex}`,
    "",
    "## Failed checks",
    "",
    ...(failed.length ? ["```", ...failed.map((v) => v.raw), "```"] : ["None."]),
    "",
    "## Last decisions",
    "",
    ...(tail.length ? ["```", ...tail, "```"] : ["None."]),
    "",
  ].join("\n");
}
