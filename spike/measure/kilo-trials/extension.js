// Measure 4 driver: runs the baseline's New Task and Add to Context commands with the note's path as argument.
// It records what the commands return and the active editor; the screenshot script records what the chat shows.
const vscode = require("vscode");
const fs = require("fs");

const OUT = process.env.TRIAL_OUT;
const NOTE = process.env.TRIAL_NOTE;
const SHOT = process.env.TRIAL_SHOT; // a command line run after each trial, with $TRIAL_LABEL set
const log = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function trial(label, command, arg) {
  const row = { label, command, argKind: arg === undefined ? "none" : typeof arg === "string" ? "path string" : "Uri" };
  try {
    const ed = vscode.window.activeTextEditor;
    row.editorBefore = ed ? `${vscode.workspace.asRelativePath(ed.document.uri)} selectionEmpty=${ed.selection.isEmpty}` : "none";
    const t = Date.now();
    row.returned = String(await vscode.commands.executeCommand(command, ...(arg === undefined ? [] : [arg])));
    row.ms = Date.now() - t;
  } catch (e) {
    row.error = String(e && e.message ? e.message : e);
  }
  await sleep(1500);
  if (SHOT) {
    try {
      require("child_process").execSync(SHOT, { env: { ...process.env, TRIAL_LABEL: label }, timeout: 20000 });
    } catch (e) {
      row.shotError = String(e.message).slice(0, 120);
    }
  }
  log.push(row);
  fs.writeFileSync(OUT, JSON.stringify(log, null, 1));
}

async function run() {
  const kilo = vscode.extensions.getExtension("kilocode.kilo-code");
  if (!kilo) throw new Error("kilocode.kilo-code not found");
  await kilo.activate();
  await sleep(6000);
  await vscode.commands.executeCommand("workbench.action.closeAllEditors");
  const uri = vscode.Uri.file(NOTE);
  // A: nothing open, as when the person has not opened the note.
  for (let i = 1; i <= 5; i++) await trial(`newTask-path-${i}`, "kilo-code.new.plusButtonClicked", NOTE);
  for (let i = 1; i <= 5; i++) await trial(`addToContext-path-${i}`, "kilo-code.new.addToContext", NOTE);
  // B: the same with a Uri, the other shape of "the note's path".
  for (let i = 1; i <= 5; i++) await trial(`newTask-uri-${i}`, "kilo-code.new.plusButtonClicked", uri);
  for (let i = 1; i <= 5; i++) await trial(`addToContext-uri-${i}`, "kilo-code.new.addToContext", uri);
  // C: control. The note is open, its text selected, and the command gets no argument.
  const doc = await vscode.workspace.openTextDocument(uri);
  const ed = await vscode.window.showTextDocument(doc);
  ed.selection = new vscode.Selection(0, 0, doc.lineCount, 0);
  await sleep(500);
  await trial("addToContext-control-selection-noarg", "kilo-code.new.addToContext", undefined);
  fs.writeFileSync(OUT + ".done", "done");
}

exports.activate = () => {
  run().catch((e) => {
    log.push({ fatal: String(e && e.stack ? e.stack : e) });
    fs.writeFileSync(OUT, JSON.stringify(log, null, 1));
    fs.writeFileSync(OUT + ".done", "failed");
  });
};
