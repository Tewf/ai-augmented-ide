// The person's questions: the list the checks leave in checks/out/needs-judgment.md, one `- [ ]` line each.

export interface Question {
  path: string;
  check: string;
  question: string;
  line: number; // 1-based line of the list item
}

const ITEM = /^- \[( |x|X)\] `([^`]+)` \(([^)]+)\): (.*)$/;

/** The entries still open (`[ ]`). An answered entry (`[x]`) is the person's and is not listed. */
export function parseQuestions(text: string): Question[] {
  const out: Question[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const m = ITEM.exec(raw);
    if (m && m[1] === " ") out.push({ path: m[2], check: m[3], question: m[4], line: i + 1 });
  });
  return out;
}
