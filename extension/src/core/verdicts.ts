// Verdicts: the lines of the runner's verdicts file, `kind check path:line message`, then a summary and an exit line.

export type Kind = "error" | "warning" | "judgment";

export interface Verdict {
  kind: Kind;
  check: string;
  path: string;
  line: number | null;
  message: string;
  raw: string;
}

export interface VerdictsFile {
  verdicts: Verdict[];
  /** The `exit N` line. A file without it was cut short, or was not written by the runner. */
  exit: number | null;
}

// The runner writes single spaces; older printed output pads its columns, so any run of spaces separates.
const VERDICT = /^(error|warning|judgment)\s+(\S+)\s+(\S+)(?:\s+(.*))?$/;

export function parseVerdicts(text: string): VerdictsFile {
  const verdicts: Verdict[] = [];
  let exit: number | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const done = /^exit (\d+)$/.exec(raw);
    if (done) { exit = Number(done[1]); continue; }
    const m = VERDICT.exec(raw);
    if (!m) continue; // the summary line and blank lines are not verdicts
    const place = /^(.*?):(\d+)$/.exec(m[3]);
    verdicts.push({
      kind: m[1] as Kind,
      check: m[2],
      path: place ? place[1] : m[3],
      line: place ? Number(place[2]) : null,
      message: m[4] ?? "",
      raw,
    });
  }
  return { verdicts, exit };
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
