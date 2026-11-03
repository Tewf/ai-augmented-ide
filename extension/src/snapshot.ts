// What one refresh read from the files. It is held only to draw the views, and rebuilt on every refresh.
import type { TopicWithLine } from "./core/topics";
import type { Verdict } from "./core/verdicts";
import type { Question } from "./core/questions";

export interface Snapshot {
  topics: TopicWithLine[];
  verdicts: Verdict[];
  /** The verdicts file's `exit N` line, null when the file is missing, cut short or not the runner's. */
  exit: number | null;
  questions: Question[];
  root: string;
}

export const empty: Snapshot = { topics: [], verdicts: [], exit: null, questions: [], root: "README.md" };
