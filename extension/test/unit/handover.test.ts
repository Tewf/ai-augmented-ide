import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { handoverNote, precedenceSentence, withIgnored } from "../../src/core/handover";
import { parseVerdicts } from "../../src/core/verdicts";

const dir = `${__dirname}/../../../test/fixtures/workspace`;
const start = readFileSync(`${dir}/START.md`, "utf8");
const { verdicts } = parseVerdicts(readFileSync(`${dir}/checks/out/verdicts.txt`, "utf8"));

test("precedenceSentence: the paragraph under the Precedence heading, none when absent", () => {
  assert.equal(precedenceSentence(start), "A rule in this file wins over a memory file, and a memory file wins over a guess.");
  assert.equal(precedenceSentence("# S\n\n## Commands\n- x\n"), null);
  assert.equal(precedenceSentence("## Precedence\n\n## Pointers\n"), null);
});

test("handoverNote: names the originals and the brief, quotes the precedence, copies no content", () => {
  const note = handoverNote({ startFile: "START.md", memoryIndex: "memory/INDEX.md", brief: "tasks/first/brief.md", startText: start, verdicts, decisionLog: "a\nb\nc\n", logLines: 2 });
  assert.ok(note.includes("- START.md\n- memory/INDEX.md\n- tasks/first/brief.md"));
  assert.ok(note.includes('START.md says: "A rule in this file wins over a memory file, and a memory file wins over a guess."'));
  assert.ok(!note.includes("python3 -m unittest"), "the start file's commands are not copied");
  assert.ok(note.includes(verdicts[0].raw), "an error is kept verbatim");
  assert.ok(!note.includes(verdicts[2].raw), "a warning is not a failed check");
  assert.ok(note.includes("b\nc") && !note.includes("\na\n"));
});

test("handoverNote: without a brief, a Precedence section or any failure it says so", () => {
  const note = handoverNote({ startFile: "S.md", memoryIndex: "M.md", brief: null, startText: "# S\n", verdicts: [], decisionLog: "", logLines: 5 });
  assert.ok(!note.includes("brief.md"));
  assert.ok(note.includes("S.md has no Precedence section."));
  assert.equal(note.split("None.").length - 1, 2);
});

test("withIgnored: adds the folder once, with a newline kept, and leaves a file that has it", () => {
  assert.equal(withIgnored("", ".ai-augmented/"), ".ai-augmented/\n");
  assert.equal(withIgnored("node_modules/", ".ai-augmented/"), "node_modules/\n.ai-augmented/\n");
  assert.equal(withIgnored("a\n.ai-augmented/\n", ".ai-augmented/"), null);
  assert.equal(withIgnored("/.ai-augmented/\n", ".ai-augmented/"), null);
});
