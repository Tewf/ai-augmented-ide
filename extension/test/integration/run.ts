// Starts the editor on a copy of the fixture workspace with the extension under development, and runs suite.ts in it.
import { cpSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { runTests } from "@vscode/test-electron";

async function main(): Promise<void> {
  const root = resolve(__dirname, "../../..");
  const scratch = mkdtempSync(join(tmpdir(), "aia-editor-"));
  const workspace = join(scratch, "workspace");
  cpSync(join(root, "test/fixtures/workspace"), workspace, { recursive: true }); // the tests write into it
  await runTests({
    extensionDevelopmentPath: root,
    extensionTestsPath: join(__dirname, "suite"),
    launchArgs: [workspace, "--disable-extensions", "--user-data-dir", join(scratch, "profile"), "--disable-workspace-trust"],
    extensionTestsEnv: { AIA_WORKSPACE: workspace },
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
