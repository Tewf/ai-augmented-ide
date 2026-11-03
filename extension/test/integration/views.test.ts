// The three views, the diagnostics and the commands, on the fixture workspace, in a running editor.
import { test, before } from "./harness";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import * as vscode from "vscode";
import type { Api } from "../../src/extension";
import { pairs } from "../../src/core/topics";

const workspace = process.env.AIA_WORKSPACE ?? "";
let api: Api;

async function until(condition: () => boolean, what: string): Promise<void> {
  for (let i = 0; i < 100; i++) {
    if (condition()) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  assert.fail(`timed out waiting for ${what}`);
}

const children = async (p: vscode.TreeDataProvider<unknown>, e?: unknown) => ((await p.getChildren(e)) ?? []) as { path?: string }[];

before(async () => {
  const ext = vscode.extensions.getExtension("tewf.ai-augmented");
  assert.ok(ext, "the extension is installed from the development path");
  api = (await ext.activate()) as Api;
  await api.refresh();
});

test("activates on a workspace that holds checks/config.toml, and contributes its five commands", async () => {
  const all = await vscode.commands.getCommands(true);
  for (const c of ["openProjectTree", "refresh", "writeHandover", "runChecks", "newTask"]) assert.ok(all.includes(`aiAugmented.${c}`), c);
});

test("the tree of topics: the pairs of the topic rule, the files the config lists", () => {
  assert.deepEqual(pairs(api.snapshot().topics), ["README.md>docs/README.md", "docs/README.md>docs/loose.md", "docs/README.md>docs/naming.md", "docs/README.md>docs/rounding.md"]);
  assert.ok(!api.snapshot().topics.some((t) => t.path === "tasks/first/brief.md"), "a file outside the config's list is no topic");
});

test("the tree view: roots, children, an item that opens the file at its heading and carries its worst verdict", async () => {
  const roots = await children(api.topicProvider);
  assert.deepEqual(roots.map((r) => r.path), ["README.md"]);
  const kids = await children(api.topicProvider, { path: "docs/README.md" });
  assert.deepEqual(kids.map((k) => k.path), ["docs/loose.md", "docs/naming.md", "docs/rounding.md"]);
  const item = await api.topicProvider.getTreeItem(kids[2]);
  assert.equal(item.label, "Rounding");
  assert.equal(item.description, "error");
  assert.equal(item.tooltip, "The ledger rounds half to even, once, at the end of a total.");
  assert.equal(item.command?.command, "vscode.open");
  assert.equal((item.command?.arguments?.[0] as vscode.Uri).path.endsWith("docs/rounding.md"), true);
});

test("the diagnostics: one per error or warning, on the named line, severity from the kind, the runner's words", () => {
  const at = (rel: string) => vscode.Uri.file(join(workspace, rel));
  const rounding = vscode.languages.getDiagnostics(at("docs/rounding.md"));
  assert.equal(rounding.length, 1);
  assert.equal(rounding[0].range.start.line, 5);
  assert.equal(rounding[0].severity, vscode.DiagnosticSeverity.Error);
  assert.equal(rounding[0].message, "a link does not resolve: missing.md");
  assert.equal(rounding[0].source, "links");
  const naming = vscode.languages.getDiagnostics(at("docs/naming.md"));
  assert.deepEqual(naming.map((d) => [d.range.start.line, d.severity]), [[0, vscode.DiagnosticSeverity.Warning]]);
  assert.equal(vscode.languages.getDiagnostics(at("docs/loose.md"))[0].range.start.line, 0, "no line sits on line 1");
  assert.equal(vscode.languages.getDiagnostics(at("README.md")).length, 1, "a verdict for a missing file sits on the root topic");
});

test("the verdicts view lists the errors and warnings, not the judgment lines", async () => {
  assert.equal((await children(api.verdictProvider)).length, 4);
});

test("the questions view lists the open entries and opens the entry at its line", async () => {
  const qs = await children(api.questionProvider);
  assert.equal(qs.length, 2);
  const item = await api.questionProvider.getTreeItem(qs[0]);
  assert.match(String(item.label), /^168 logical lines/);
  const sel = (item.command?.arguments?.[1] as { selection: vscode.Range }).selection;
  assert.equal(sel.start.line, 4);
});

test("the hand-over note: written under .ai-augmented/, names START.md, the index and the open brief, ignored by git", async () => {
  await vscode.window.showTextDocument(vscode.Uri.file(join(workspace, "tasks/first/brief.md")));
  await vscode.commands.executeCommand("aiAugmented.writeHandover");
  const note = readFileSync(join(workspace, ".ai-augmented/handover.md"), "utf8");
  assert.ok(note.includes("- START.md\n- memory/INDEX.md\n- tasks/first/brief.md"));
  assert.ok(note.includes("a memory file wins over a guess."));
  assert.ok(note.includes("error links docs/rounding.md:6 a link does not resolve: missing.md"));
  assert.equal(readFileSync(join(workspace, ".gitignore"), "utf8"), "node_modules/\n.ai-augmented/\n");
  await vscode.commands.executeCommand("aiAugmented.writeHandover");
  assert.equal(readFileSync(join(workspace, ".gitignore"), "utf8"), "node_modules/\n.ai-augmented/\n", "the second write adds nothing");
});

test("new task: with no agent installed it opens the note for the person to attach", async () => {
  await vscode.commands.executeCommand("aiAugmented.newTask");
  assert.ok(vscode.window.activeTextEditor?.document.uri.path.endsWith(".ai-augmented/handover.md"));
});

test("run the checks: the configured command runs, and the views show what it wrote", async () => {
  await vscode.commands.executeCommand("aiAugmented.runChecks");
  await until(() => api.snapshot().verdicts.length === 1, "the new verdicts");
  assert.equal(api.snapshot().exit, 1);
  const naming = vscode.languages.getDiagnostics(vscode.Uri.file(join(workspace, "docs/naming.md")));
  assert.deepEqual(naming.map((d) => [d.range.start.line, d.message]), [[2, "planted by the fake runner"]]);
  assert.equal(vscode.languages.getDiagnostics(vscode.Uri.file(join(workspace, "docs/rounding.md"))).length, 0);
  assert.ok(existsSync(join(workspace, "checks/out/verdicts.txt")));
});
