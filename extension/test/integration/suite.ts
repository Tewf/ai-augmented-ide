// Runs inside the editor: loads the test file, which registers its tests, then runs them in order.
import { runAll } from "./harness";

export async function run(): Promise<void> {
  require("./views.test");
  const { passed, failed } = await runAll((line) => console.log(line));
  console.log(`editor tests: ${passed} passed, ${failed.length} failed`);
  if (failed.length || !passed) throw new Error(`${failed.length} editor test(s) failed: ${failed.join("; ")}`);
}
