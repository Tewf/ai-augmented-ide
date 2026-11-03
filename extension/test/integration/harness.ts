// A small sequential test registry for the editor process. node:test would start a subprocess for each file,
// and a subprocess has no `vscode` module; the readers' tests, which need none, do use node:test.
type Body = () => void | Promise<void>;

const tests: { name: string; body: Body }[] = [];
const setups: Body[] = [];

export function test(name: string, body: Body): void {
  tests.push({ name, body });
}

export function before(body: Body): void {
  setups.push(body);
}

/** Runs the setups, then the tests in order. Returns the names that failed, with their errors. */
export async function runAll(log: (line: string) => void): Promise<{ passed: number; failed: string[] }> {
  for (const setup of setups) await setup();
  let passed = 0;
  const failed: string[] = [];
  for (const t of tests) {
    try {
      await t.body();
      passed++;
      log(`  ok   ${t.name}`);
    } catch (err) {
      failed.push(t.name);
      log(`  FAIL ${t.name}\n${err instanceof Error ? err.stack : String(err)}`);
    }
  }
  return { passed, failed };
}
