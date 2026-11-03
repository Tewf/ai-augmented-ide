// The tree of topics, read as the topic check reads it. No editor import: pure functions of text.

import * as posix from "node:path/posix";

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

export interface TitleAndSummary {
  title: string;
  summary: string;
  titleLine: number; // 1-based line of the title heading, 0 when there is none
}

/** Title: the first "# " heading outside a code fence. Summary: the first paragraph after it, labels dropped. */
export function titleAndSummary(text: string): TitleAndSummary {
  let fence = false;
  let title = "";
  let titleLine = 0;
  const para: string[] = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue; }
    if (fence) continue;
    if (!title) {
      const m = /^# (.+?)\s*$/.exec(line);
      if (m) { title = m[1]; titleLine = i + 1; }
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
  return { title, summary, titleLine };
}

export interface TopicWithLine extends Topic {
  line: number; // 1-based line of the heading a click opens
}

/** The topics among the given workspace-relative paths, each with its parent by the topic check's rule. */
export function readTopics(paths: string[], read: (p: string) => string, patterns: string[]): TopicWithLine[] {
  const set = new Set(paths.filter((p) => p.endsWith(".md") && matchesAny(p, patterns)));
  return [...set].sort().map((path) => {
    const { title, summary, titleLine } = titleAndSummary(read(path));
    return { path, title: title || path, summary, parent: containing(path, set), line: titleLine || 1 };
  });
}

/** The parent and child pairs the tree draws, as "parent>child", sorted. The root has no pair. */
export function pairs(topics: Topic[]): string[] {
  return topics.filter((t) => t.parent).map((t) => `${t.parent}>${t.path}`).sort();
}
