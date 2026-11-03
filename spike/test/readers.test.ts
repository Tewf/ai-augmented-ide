import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as r from "../src/readers";

const fixture = (name: string) => readFileSync(`${__dirname}/../../fixtures/${name}`, "utf8");

test("matchesAny: a folder pattern covers what is under it, a glob crosses slashes", () => {
  assert.ok(r.matchesAny("evidence/a/b.md", ["evidence/"]));
  assert.ok(r.matchesAny("evidence", ["evidence/"]));
  assert.ok(!r.matchesAny("evidences/a.md", ["evidence/"]));
  assert.ok(r.matchesAny("decisions/0001-x.md", ["decisions/0*.md"]));
  assert.ok(!r.matchesAny("decisions/README.md", ["decisions/0*.md"]));
});

test("containing: the nearest README above, and above its own folder for a README", () => {
  const set = new Set(["README.md", "evidence/README.md", "evidence/a/README.md", "evidence/a/b.md", "design/x.md"]);
  assert.equal(r.containing("evidence/a/b.md", set), "evidence/a/README.md");
  assert.equal(r.containing("evidence/a/README.md", set), "evidence/README.md");
  assert.equal(r.containing("evidence/README.md", set), "README.md");
  assert.equal(r.containing("design/x.md", set), "README.md");
  assert.equal(r.containing("README.md", set), null);
});

test("titleAndSummary: title first, summary the next paragraph, labels dropped, fences skipped", () => {
  const t = r.titleAndSummary("```\n# not a title\n```\n# Real\n\n**Abstract.** It stands for the topic.\nOn two lines.\n\nLater.");
  assert.equal(t.title, "Real");
  assert.equal(t.summary, "It stands for the topic. On two lines.");
  assert.deepEqual(r.titleAndSummary("no heading"), { title: "", summary: "" });
});

test("readTopics and pairs: the tree is the set of parent and child pairs", () => {
  const files: Record<string, string> = { "README.md": "# Root\n\nr.", "a/README.md": "# A\n\na.", "a/b.md": "# B\n\nb.", "skip/c.md": "# C\n\nc." };
  const topics = r.readTopics(Object.keys(files), (p) => files[p], ["README.md", "a/"]);
  assert.deepEqual(r.pairs(topics), ["README.md>a/README.md", "a/README.md>a/b.md"]);
  assert.equal(topics.find((t) => t.path === "a/b.md")?.title, "B");
});

test("parseVerdicts: the runner's lines, and nothing else", () => {
  const v = r.parseVerdicts(fixture("verdicts.txt"));
  assert.equal(v.length, 5);
  assert.deepEqual(
    v.map((x) => [x.kind, x.check, x.path, x.line]),
    [
      ["error", "topic", "decisions/0001-a.md", 12],
      ["warning", "topic", "evidence/x/README.md", 1],
      ["error", "links", "README.md", null],
      ["error", "links", "gone/file.md", 7],
      ["judgment", "logical-lines", "design/extension.md", 1],
    ],
  );
  assert.match(v[0].message, /^not listed by its containing topic decisions\/README.md:/);
  assert.equal(v[2].message, "a link does not resolve: missing.md");
});

test("place: no line goes to line 1, a missing file to the root topic, judgments are not diagnostics", () => {
  const v = r.parseVerdicts(fixture("verdicts.txt"));
  const placed = r.place(v, (p) => p !== "gone/file.md", "README.md");
  assert.equal(placed.length, 4);
  assert.deepEqual(placed.map((p) => [p.path, p.line]), [["decisions/0001-a.md", 12], ["evidence/x/README.md", 1], ["README.md", 1], ["README.md", 7]]);
});

test("worstKind: an error outranks a warning, a clean file has none", () => {
  const v = r.parseVerdicts(fixture("verdicts.txt"));
  assert.equal(r.worstKind(v, "decisions/0001-a.md"), "error");
  assert.equal(r.worstKind(v, "evidence/x/README.md"), "warning");
  assert.equal(r.worstKind(v, "design/extension.md"), null);
});

test("parseJudgments: entries with their header line, open ones are those without an answer", () => {
  const all = r.parseJudgments(fixture("judgments-to-answer.toml"));
  assert.equal(all.length, 2);
  assert.equal(all[0].question, '168 logical lines, past the trigger of 80. State "the role" in one sentence.');
  assert.equal(all[0].line, 1);
  assert.equal(all[1].line, 8);
  assert.deepEqual(r.openQuestions(all).map((q) => q.check), ["logical-lines"]);
});

test("handoverNote: names the two originals, copies no content, keeps failed lines verbatim", () => {
  const v = r.parseVerdicts(fixture("verdicts.txt"));
  const note = r.handoverNote({ startFile: "START.md", memoryIndex: "memory/INDEX.md", verdicts: v, decisionLog: "a\nb\nc\n", logLines: 2 });
  assert.ok(note.includes("- START.md\n- memory/INDEX.md"));
  assert.ok(note.includes(v[0].raw));
  assert.ok(!note.includes(v[1].raw), "a warning is not a failed check");
  assert.ok(note.includes("b\nc") && !note.includes("\na\n"));
  assert.ok(r.handoverNote({ startFile: "S", memoryIndex: "M", verdicts: [], decisionLog: "", logLines: 5 }).includes("None."));
});
