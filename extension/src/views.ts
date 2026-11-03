// The three tree views. Each reads the snapshot the extension holds for one refresh; none stores anything.
import * as vscode from "vscode";
import type { Snapshot } from "./snapshot";
import type { TopicWithLine } from "./core/topics";
import type { Verdict } from "./core/verdicts";
import type { Question } from "./core/questions";
import { worstKind } from "./core/verdicts";

type At = (rel: string) => vscode.Uri;

function openAt(uri: vscode.Uri, line: number): vscode.Command {
  const pos = new vscode.Position(Math.max(line - 1, 0), 0);
  return { command: "vscode.open", title: "Open", arguments: [uri, { selection: new vscode.Range(pos, pos) }] };
}

export function topicView(get: () => Snapshot, at: At, changed: vscode.Event<void>): vscode.TreeDataProvider<TopicWithLine> {
  return {
    onDidChangeTreeData: changed,
    getChildren: (t) => get().topics.filter((x) => (t ? x.parent === t.path : x.parent === null)),
    getParent: (t) => get().topics.find((x) => x.path === t.parent),
    getTreeItem: (t) => {
      const snap = get();
      const hasChildren = snap.topics.some((x) => x.parent === t.path);
      const item = new vscode.TreeItem(t.title, hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
      item.id = t.path;
      item.tooltip = t.summary || t.path;
      const worst = worstKind(snap.verdicts, t.path);
      item.description = worst ?? undefined;
      item.iconPath = new vscode.ThemeIcon(worst === "error" ? "error" : worst === "warning" ? "warning" : "file");
      item.resourceUri = at(t.path);
      item.command = openAt(at(t.path), t.line);
      return item;
    },
  };
}

export function verdictView(get: () => Snapshot, at: At, changed: vscode.Event<void>): vscode.TreeDataProvider<Verdict> {
  return {
    onDidChangeTreeData: changed,
    getChildren: (v) => (v ? [] : get().verdicts.filter((x) => x.kind !== "judgment")),
    getTreeItem: (v) => {
      const item = new vscode.TreeItem(v.message, vscode.TreeItemCollapsibleState.None);
      item.description = v.line ? `${v.path}:${v.line}` : v.path;
      item.tooltip = v.raw;
      item.iconPath = new vscode.ThemeIcon(v.kind === "error" ? "error" : "warning");
      item.command = openAt(at(v.path), v.line ?? 1);
      return item;
    },
  };
}

export function questionView(get: () => Snapshot, at: At, changed: vscode.Event<void>, file: () => string): vscode.TreeDataProvider<Question> {
  return {
    onDidChangeTreeData: changed,
    getChildren: (q) => (q ? [] : get().questions),
    getTreeItem: (q) => {
      const item = new vscode.TreeItem(q.question, vscode.TreeItemCollapsibleState.None);
      item.description = q.path;
      item.tooltip = `${q.check}: ${q.path}`;
      item.iconPath = new vscode.ThemeIcon("question");
      item.command = openAt(at(file()), q.line); // the entry, where the person answers it
      return item;
    },
  };
}
