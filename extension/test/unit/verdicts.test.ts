import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as v from "../../src/core/verdicts";

const fixture = readFileSync(`${__dirname}/../../../test/fixtures/workspace/checks/out/verdicts.txt`, "utf8");

test("parseVerdicts: the runner's lines, the exit line, nothing else", () => {
  const r = v.parseVerdicts(fixture);
  assert.equal(r.exit, 1);
  assert.deepEqual(
    r.verdicts.map((x) => [x.kind, x.check, x.path, x.line]),
    [
      ["error", "links", "docs/rounding.md", 6],
      ["error", "topic", "docs/loose.md", null],
      ["warning", "topic", "docs/naming.md", 1],
      ["error", "links", "gone/file.md", 7],
      ["judgment", "logical-lines", "docs/rounding.md", 1],
    ],
  );
  assert.equal(r.verdicts[0].message, "a link does not resolve: missing.md");
  assert.match(r.verdicts[1].message, /^not listed by its containing topic docs\/README\.md:/);
});

test("parseVerdicts: padded columns of the printed output read the same, a cut file has no exit", () => {
  const r = v.parseVerdicts("error    topic                a.md:12  not listed\nwarning  links                b.md  odd");
  assert.equal(r.exit, null);
  assert.deepEqual(r.verdicts.map((x) => [x.path, x.line, x.message]), [["a.md", 12, "not listed"], ["b.md", null, "odd"]]);
  assert.deepEqual(v.parseVerdicts("").verdicts, []);
});

test("place: no line goes to line 1, a missing file to the root topic, judgments are not diagnostics", () => {
  const r = v.parseVerdicts(fixture);
  const placed = v.place(r.verdicts, (p) => p !== "gone/file.md", "README.md");
  assert.deepEqual(placed.map((p) => [p.path, p.line]), [["docs/rounding.md", 6], ["docs/loose.md", 1], ["docs/naming.md", 1], ["README.md", 7]]);
});

test("worstKind: an error outranks a warning, a clean file has none", () => {
  const r = v.parseVerdicts(fixture);
  assert.equal(v.worstKind(r.verdicts, "docs/rounding.md"), "error");
  assert.equal(v.worstKind(r.verdicts, "docs/naming.md"), "warning");
  assert.equal(v.worstKind(r.verdicts, "README.md"), null);
});
