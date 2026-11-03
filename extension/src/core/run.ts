// Running the checks through a child process, without a shell. Only on the person's request.

import { execFile } from "node:child_process";

export interface RunResult {
  /** The exit status; the runner exits non-zero when a check fails, which is a result, not a failure to run. */
  code: number | null;
  stderr: string;
  /** Set when the command could not start at all. */
  error: string | null;
}

export function expand(command: string[], vars: Record<string, string>): string[] {
  return command.map((part) => part.replace(/\$\{(\w+)\}/g, (all, name: string) => vars[name] ?? all));
}

export function runChecks(command: string[], cwd: string, vars: Record<string, string>, timeoutMs = 300000): Promise<RunResult> {
  const [program, ...args] = expand(command, vars);
  if (!program) return Promise.resolve({ code: null, stderr: "", error: "the check command is empty" });
  return new Promise((resolve) => {
    execFile(program, args, { cwd, timeout: timeoutMs, maxBuffer: 16 * 1024 * 1024 }, (err, _stdout, stderr) => {
      if (!err) return resolve({ code: 0, stderr, error: null });
      const e = err as NodeJS.ErrnoException & { code?: number | string };
      if (typeof e.code === "number") return resolve({ code: e.code, stderr, error: null });
      resolve({ code: null, stderr, error: e.message });
    });
  });
}
