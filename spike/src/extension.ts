// The editor side: three views and one command. Everything shown is read from files on each refresh.
import * as vscode from "vscode";
import * as readers from "./readers";

const enc = new TextDecoder();

async function readText(uri: vscode.Uri): Promise<string> {
  try {
    return enc.decode(await vscode.workspace.fs.readFile(uri));
  } catch {
    return "";
  }
}

interface Snapshot {
  topics: readers.Topic[];
  verdicts: readers.Verdict[];
  questions: readers.Question[];
}

export function activate(context: vscode.ExtensionContext): void {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) return;
  const cfg = () => vscode.workspace.getConfiguration("aiIde");
  const at = (rel: string) => vscode.Uri.joinPath(folder.uri, rel);
  const diagnostics = vscode.languages.createDiagnosticCollection("aiIde");
  const changed = new vscode.EventEmitter<void>();
  let snap: Snapshot = { topics: [], verdicts: [], questions: [] };

  async function refresh(): Promise<void> {
    const patterns = cfg().get<string[]>("topicFiles", []);
    const root = cfg().get<string>("rootTopic", "README.md");
    const found = await vscode.workspace.findFiles("**/*.md", "**/{node_modules,out,.git}/**");
    const rels = found.map((u) => vscode.workspace.asRelativePath(u, false));
    const texts = new Map<string, string>();
    for (const r of rels) if (readers.matchesAny(r, patterns)) texts.set(r, await readText(at(r)));
    const topics = readers.readTopics(rels, (p) => texts.get(p) ?? "", patterns);
    const verdicts = readers.parseVerdicts(await readText(at(cfg().get<string>("verdictsFile", ""))));
    const questions = readers.openQuestions(readers.parseJudgments(await readText(at(cfg().get<string>("judgmentsFile", "")))));
    snap = { topics, verdicts, questions };

    diagnostics.clear();
    const byFile = new Map<string, vscode.Diagnostic[]>();
    for (const p of readers.place(verdicts, (x) => rels.includes(x), root)) {
      const range = new vscode.Range(p.line - 1, 0, p.line - 1, Number.MAX_SAFE_INTEGER);
      const sev = p.verdict.kind === "error" ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;
      const d = new vscode.Diagnostic(range, p.verdict.message, sev); // the runner's words, unchanged
      d.source = p.verdict.check;
      byFile.set(p.path, [...(byFile.get(p.path) ?? []), d]);
    }
    for (const [rel, list] of byFile) diagnostics.set(at(rel), list);
    changed.fire();
  }

  const topicView: vscode.TreeDataProvider<readers.Topic> = {
    onDidChangeTreeData: changed.event,
    getChildren: (t) => snap.topics.filter((x) => (t ? x.parent === t.path : x.parent === null)),
    getTreeItem: (t) => {
      const kids = snap.topics.some((x) => x.parent === t.path);
      const item = new vscode.TreeItem(t.title, kids ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
      item.tooltip = t.summary || t.path;
      const worst = readers.worstKind(snap.verdicts, t.path);
      item.description = worst ?? undefined;
      item.iconPath = new vscode.ThemeIcon(worst === "error" ? "error" : worst === "warning" ? "warning" : "file");
      item.command = { command: "vscode.open", title: "Open", arguments: [at(t.path)] };
      return item;
    },
  };

  const questionView: vscode.TreeDataProvider<readers.Question> = {
    onDidChangeTreeData: changed.event,
    getChildren: (q) => (q ? [] : snap.questions),
    getTreeItem: (q) => {
      const item = new vscode.TreeItem(q.question, vscode.TreeItemCollapsibleState.None);
      item.description = q.path;
      item.tooltip = `${q.check}: ${q.path}`;
      const file = cfg().get<string>("judgmentsFile", "");
      item.command = {
        command: "vscode.open",
        title: "Open the entry",
        arguments: [at(file), { selection: new vscode.Range(q.line - 1, 0, q.line - 1, 0) }],
      };
      return item;
    },
  };

  context.subscriptions.push(
    diagnostics,
    vscode.window.registerTreeDataProvider("aiIde.topics", topicView),
    vscode.window.registerTreeDataProvider("aiIde.questions", questionView),
    vscode.commands.registerCommand("aiIde.refresh", refresh),
    vscode.commands.registerCommand("aiIde.handover", async () => {
      const note = readers.handoverNote({
        startFile: cfg().get<string>("startFile", ""),
        memoryIndex: cfg().get<string>("memoryIndex", ""),
        verdicts: snap.verdicts,
        decisionLog: await readText(at(cfg().get<string>("decisionLog", ""))),
        logLines: 5,
      });
      const target = at(`${cfg().get<string>("noteFolder", ".handover")}/note.md`);
      await vscode.workspace.fs.writeFile(target, new TextEncoder().encode(note));
      await vscode.window.showTextDocument(target);
    }),
  );

  const watcher = vscode.workspace.createFileSystemWatcher("**/*.{md,txt,toml}");
  for (const event of [watcher.onDidChange, watcher.onDidCreate, watcher.onDidDelete]) {
    context.subscriptions.push(event(() => void refresh()));
  }
  context.subscriptions.push(watcher);
  void refresh();
}

export function deactivate(): void {}
