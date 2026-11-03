// The hand-over note: it names the originals by path and copies none of them.
// It quotes one sentence, the start file's precedence rule, so that the rule is in front of the agent.

import type { Verdict } from "./verdicts";

/** The first paragraph under the "## Precedence" heading, on one line; null when the file has none. */
export function precedenceSentence(startText: string): string | null {
  const lines = startText.split(/\r?\n/);
  const at = lines.findIndex((l) => /^##\s+Precedence\s*$/.test(l));
  if (at < 0) return null;
  const para: string[] = [];
  for (const line of lines.slice(at + 1)) {
    if (/^#{1,6}\s/.test(line)) break;
    if (!line.trim()) { if (para.length) break; continue; }
    para.push(line.trim());
  }
  return para.length ? para.join(" ") : null;
}

export interface HandoverInput {
  startFile: string;
  memoryIndex: string;
  /** The brief of the task that is open, as a workspace path, or null. */
  brief: string | null;
  startText: string;
  verdicts: Verdict[];
  decisionLog: string;
  logLines: number;
}

/** The failed checks are the runner's lines, verbatim. */
export function handoverNote(i: HandoverInput): string {
  const failed = i.verdicts.filter((v) => v.kind === "error");
  const tail = i.decisionLog.split(/\r?\n/).filter((l) => l.trim()).slice(-i.logLines);
  const precedence = precedenceSentence(i.startText);
  return [
    "# Hand-over note",
    "",
    "Derived and disposable. Read these files first, in full:",
    "",
    `- ${i.startFile}`,
    `- ${i.memoryIndex}`,
    ...(i.brief ? [`- ${i.brief}`] : []),
    "",
    "## Precedence",
    "",
    precedence ? `${i.startFile} says: "${precedence}"` : `${i.startFile} has no Precedence section.`,
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

/** The ignore file's new text when it lacks the folder, else null. */
export function withIgnored(ignoreText: string, entry: string): string | null {
  const has = ignoreText.split(/\r?\n/).some((l) => l.trim() === entry || l.trim() === "/" + entry);
  if (has) return null;
  const sep = ignoreText === "" || ignoreText.endsWith("\n") ? "" : "\n";
  return `${ignoreText}${sep}${entry}\n`;
}
