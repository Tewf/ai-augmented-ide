// The editor side: three views, the diagnostics, five commands. Everything shown is read from files on each refresh.
import * as vscode from "vscode";
import { empty, Snapshot } from "./snapshot";
import { readTopics, matchesAny } from "./core/topics";
import { readTopicConfig } from "./core/config";
import { parseVerdicts, place } from "./core/verdicts";
import { parseQuestions } from "./core/questions";
import { handoverNote, withIgnored } from "./core/handover";
import { runChecks } from "./core/run";
import { topicView, verdictView, questionView } from "./views";
import { openNewTask } from "./adapter";

const decoder = new TextDecoder();
const encoder = new TextEncoder();
export const NOTE = ".ai-augmented/handover.md";

/** What the tests may call; the extension itself needs none of it. */
export interface Api {
  refresh(): Promise<void>;
  snapshot(): Snapshot;
  topicProvider: vscode.TreeDataProvider<unknown>;
  verdictProvider: vscode.TreeDataProvider<unknown>;
  questionProvider: vscode.TreeDataProvider<unknown>;
}

async function readText(uri: vscode.Uri): Promise<string> {
  try {
    return decoder.decode(await vscode.workspace.fs.readFile(uri));
  } catch {
    return "";
  }
}

export function activate(context: vscode.ExtensionContext): Api | undefined {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) return undefined;
  const cfg = () => vscode.workspace.getConfiguration("aiAugmented");
  const setting = (key: string) => cfg().get<string>(key, "");
  const at = (rel: string) => vscode.Uri.joinPath(folder.uri, rel);
  const diagnostics = vscode.languages.createDiagnosticCollection("aiAugmented");
  const changed = new vscode.EventEmitter<void>();
  let snap: Snapshot = empty;

  async function refresh(): Promise<void> {
    const fromConfig = readTopicConfig(await readText(at("checks/config.toml")));
    const set = cfg().get<string[]>("topicFiles", []);
    const patterns = set.length ? set : fromConfig.files ?? ["*.md"];
    const root = setting("rootTopic") || fromConfig.root || "README.md";
    const found = await vscode.workspace.findFiles("**/*.md", "**/{node_modules,out,.git,.vscode-test}/**");
    const rels = found.map((u) => vscode.workspace.asRelativePath(u, false));
    const texts = new Map<string, string>();
    for (const r of rels) if (matchesAny(r, patterns)) texts.set(r, await readText(at(r)));
    const topics = readTopics(rels, (p) => texts.get(p) ?? "", patterns);
    const file = parseVerdicts(await readText(at(setting("verdictsFile"))));
    const questions = parseQuestions(await readText(at(setting("questionsFile"))));
    snap = { topics, verdicts: file.verdicts, exit: file.exit, questions, root };

    diagnostics.clear();
    const byFile = new Map<string, vscode.Diagnostic[]>();
    for (const p of place(file.verdicts, (x) => rels.includes(x), root)) {
      const range = new vscode.Range(p.line - 1, 0, p.line - 1, Number.MAX_SAFE_INTEGER);
      const severity = p.verdict.kind === "error" ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;
      const d = new vscode.Diagnostic(range, p.verdict.message, severity); // the runner's words, unchanged
      d.source = p.verdict.check;
      byFile.set(p.path, [...(byFile.get(p.path) ?? []), d]);
    }
    for (const [rel, list] of byFile) diagnostics.set(at(rel), list);
    changed.fire();
  }

  async function run(): Promise<void> {
    const verdictsFile = setting("verdictsFile");
    const result = await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Window, title: "AI-augmented: running the checks" },
      () => runChecks(cfg().get<string[]>("checkCommand", []), folder!.uri.fsPath, { verdictsFile }),
    );
    if (result.error) void vscode.window.showErrorMessage(`The check command did not run: ${result.error}`);
    await refresh();
  }

  async function writeHandover(): Promise<vscode.Uri> {
    const startFile = setting("startFile");
    const active = vscode.window.activeTextEditor?.document.uri;
    const briefPath = active && /(^|\/)brief\.md$/.test(active.path) ? vscode.workspace.asRelativePath(active, false) : null;
    const note = handoverNote({
      startFile,
      memoryIndex: setting("memoryIndex"),
      brief: briefPath,
      startText: await readText(at(startFile)),
      verdicts: snap.verdicts,
      decisionLog: await readText(at(setting("decisionLog"))),
      logLines: 5,
    });
    const target = at(NOTE);
    await vscode.workspace.fs.writeFile(target, encoder.encode(note));
    const ignore = at(".gitignore");
    const next = withIgnored(await readText(ignore), ".ai-augmented/");
    if (next !== null) await vscode.workspace.fs.writeFile(ignore, encoder.encode(next));
    return target;
  }

  const topics = topicView(() => snap, at, changed.event);
  const verdictsTree = verdictView(() => snap, at, changed.event);
  const questions = questionView(() => snap, at, changed.event, () => setting("questionsFile"));

  context.subscriptions.push(
    diagnostics,
    changed,
    vscode.window.registerTreeDataProvider("aiAugmented.topics", topics),
    vscode.window.registerTreeDataProvider("aiAugmented.verdicts", verdictsTree),
    vscode.window.registerTreeDataProvider("aiAugmented.questions", questions),
    vscode.commands.registerCommand("aiAugmented.openProjectTree", () => vscode.commands.executeCommand("aiAugmented.topics.focus")),
    vscode.commands.registerCommand("aiAugmented.refresh", refresh),
    vscode.commands.registerCommand("aiAugmented.runChecks", run),
    vscode.commands.registerCommand("aiAugmented.writeHandover", async () => {
      await vscode.window.showTextDocument(await writeHandover());
    }),
    vscode.commands.registerCommand("aiAugmented.newTask", async () => {
      const note = await writeHandover();
      const opened = await openNewTask();
      await vscode.window.showTextDocument(note, { preview: false });
      if (!opened) void vscode.window.showInformationMessage("No supported agent found. Attach the hand-over note to your agent.");
    }),
  );

  const watcher = vscode.workspace.createFileSystemWatcher("**/*.{md,txt,toml}");
  for (const event of [watcher.onDidChange, watcher.onDidCreate, watcher.onDidDelete]) {
    context.subscriptions.push(event(() => void refresh()));
  }
  context.subscriptions.push(
    watcher,
    vscode.workspace.onDidSaveTextDocument(() => {
      if (cfg().get<boolean>("runOnSave", false)) void run();
    }),
  );
  void refresh();

  return {
    refresh,
    snapshot: () => snap,
    topicProvider: topics as vscode.TreeDataProvider<unknown>,
    verdictProvider: verdictsTree as vscode.TreeDataProvider<unknown>,
    questionProvider: questions as vscode.TreeDataProvider<unknown>,
  };
}

export function deactivate(): void {}
