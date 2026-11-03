// The one adapter: the baseline agent's documented commands, used only to open a new task.
// Both commands take no argument (spike, measure 4), so the note is opened in the editor and the person attaches it.
import * as vscode from "vscode";

/** Kilo Code's New Task command (its manifest, version 7.8.x). */
export const NEW_TASK = "kilo-code.new.plusButtonClicked";

export async function agentAvailable(): Promise<boolean> {
  return (await vscode.commands.getCommands(true)).includes(NEW_TASK);
}

/** Opens a new task in the agent. Returns false when the agent is not installed; the note is then still opened. */
export async function openNewTask(): Promise<boolean> {
  if (!(await agentAvailable())) return false;
  await vscode.commands.executeCommand(NEW_TASK);
  return true;
}
