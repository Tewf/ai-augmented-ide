import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseQuestions } from "../../src/core/questions";

const fixture = readFileSync(`${__dirname}/../../../test/fixtures/workspace/checks/out/needs-judgment.md`, "utf8");

test("parseQuestions: only the open entries, each with its line", () => {
  const q = parseQuestions(fixture);
  assert.deepEqual(q.map((x) => [x.path, x.check, x.line]), [["docs/rounding.md", "logical-lines", 5], ["README.md", "logical-lines", 7]]);
  assert.match(q[0].question, /^168 logical lines/);
});

test("parseQuestions: prose, headings and a malformed item are not entries", () => {
  assert.deepEqual(parseQuestions("# Questions\n\n- [ ] no path here\n- plain item\n"), []);
});
