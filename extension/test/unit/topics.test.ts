import { test } from "node:test";
import assert from "node:assert/strict";
import * as t from "../../src/core/topics";
import { readTopicConfig } from "../../src/core/config";

test("matchesAny: a folder pattern covers what is under it, a glob crosses slashes", () => {
  assert.ok(t.matchesAny("evidence/a/b.md", ["evidence/"]));
  assert.ok(t.matchesAny("evidence", ["evidence/"]));
  assert.ok(!t.matchesAny("evidences/a.md", ["evidence/"]));
  assert.ok(t.matchesAny("decisions/0001-x.md", ["decisions/0*.md"]));
  assert.ok(!t.matchesAny("decisions/README.md", ["decisions/0*.md"]));
});

test("containing: the nearest README above, and above its own folder for a README", () => {
  const set = new Set(["README.md", "evidence/README.md", "evidence/a/README.md", "evidence/a/b.md", "design/x.md"]);
  assert.equal(t.containing("evidence/a/b.md", set), "evidence/a/README.md");
  assert.equal(t.containing("evidence/a/README.md", set), "evidence/README.md");
  assert.equal(t.containing("evidence/README.md", set), "README.md");
  assert.equal(t.containing("design/x.md", set), "README.md");
  assert.equal(t.containing("README.md", set), null);
});

test("titleAndSummary: title first with its line, summary the next paragraph, labels dropped, fences skipped", () => {
  const r = t.titleAndSummary("```\n# not a title\n```\n# Real\n\n**Abstract.** It stands for the topic.\nOn two lines.\n\nLater.");
  assert.equal(r.title, "Real");
  assert.equal(r.titleLine, 4);
  assert.equal(r.summary, "It stands for the topic. On two lines.");
  assert.deepEqual(t.titleAndSummary("no heading"), { title: "", summary: "", titleLine: 0 });
});

test("readTopics and pairs: the tree is the set of parent and child pairs", () => {
  const files: Record<string, string> = { "README.md": "# Root\n\nr.", "a/README.md": "# A\n\na.", "a/b.md": "# B\n\nb.", "skip/c.md": "# C\n\nc." };
  const topics = t.readTopics(Object.keys(files), (p) => files[p], ["README.md", "a/"]);
  assert.deepEqual(t.pairs(topics), ["README.md>a/README.md", "a/README.md>a/b.md"]);
  assert.equal(topics.find((x) => x.path === "a/b.md")?.title, "B");
});

test("readTopicConfig: files and root of the [topic] table, comments and other tables ignored", () => {
  const text = [
    'files = ["not-this.md"]',
    "[topic]",
    'files = ["README.md", "evidence/", "decisions/0*.md"]   # the tree',
    'root = "README.md"',
    'shapes = { decision-record = ["decisions/0*.md"] }',
    "[other]",
    'root = "no"',
  ].join("\n");
  assert.deepEqual(readTopicConfig(text), { files: ["README.md", "evidence/", "decisions/0*.md"], root: "README.md" });
  assert.deepEqual(readTopicConfig('[topic]\nfiles = [\n  "a.md",\n  "b/",\n]\n'), { files: ["a.md", "b/"], root: null });
  assert.deepEqual(readTopicConfig("extends = 'x'"), { files: null, root: null });
});
