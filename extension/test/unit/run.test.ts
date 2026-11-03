import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expand, runChecks } from "../../src/core/run";

test("expand: ${name} is replaced, an unknown name is left as written", () => {
  assert.deepEqual(expand(["a", "${f}", "${nope}"], { f: "x.txt" }), ["a", "x.txt", "${nope}"]);
});

test("runChecks: runs the command in the folder, passes the variable, reports a non-zero exit as a result", async () => {
  const dir = mkdtempSync(join(tmpdir(), "aia-"));
  const script = "require('fs').writeFileSync(process.argv[1], 'exit 1\\n'); process.exit(1)";
  const r = await runChecks([process.execPath, "-e", script, "${out}"], dir, { out: "v.txt" });
  assert.deepEqual([r.code, r.error], [1, null]);
  assert.equal(readFileSync(join(dir, "v.txt"), "utf8"), "exit 1\n");
});

test("runChecks: a command that does not exist is an error, an empty one too", async () => {
  const r = await runChecks(["no-such-program-here"], tmpdir(), {});
  assert.equal(r.code, null);
  assert.match(r.error ?? "", /ENOENT/);
  assert.equal((await runChecks([], tmpdir(), {})).error, "the check command is empty");
});
