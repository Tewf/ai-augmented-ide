// Measures 1 to 3 of the design's spike on two corpora. Measures 4 and 5 need the baseline and a model: not here.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, appendFileSync, writeFileSync, watch } from "node:fs";
import { dirname, join, resolve } from "node:path";
import * as r from "../src/readers";

const PATTERNS = ["README.md", "evidence/", "decisions/", "design/"];
const here = resolve(__dirname, "../.."); // spike/
const repo = resolve(here, "..");
const standard = process.env.STANDARD ?? join(repo, "checks/out/standard/checks");
const topicLocal = process.env.TOPIC ?? resolve(repo, "../reader-ergonomics-topic/checks/local");
const python = process.env.PYTHON ?? "python3";
const corpora = [
  { name: "this-repository", path: repo },
  { name: "the-method", path: process.env.METHOD ?? resolve(repo, "../ai-augmented-project") },
];

const git = (cwd: string, ...a: string[]) => execFileSync("git", ["-C", cwd, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });
const listFiles = (cwd: string) => git(cwd, "ls-files", "-z", "--cached", "--others", "--exclude-standard").split("\0").filter(Boolean);

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

async function run(): Promise<void> {
  const out = join(here, "out/corpora");
  rmSync(out, { recursive: true, force: true });
  const report: Record<string, unknown>[] = [];
  for (const c of corpora) {
    const files = listFiles(c.path).filter((f) => existsSync(join(c.path, f)));
    const md = files.filter((f) => f.endsWith(".md"));
    const read = (p: string) => readFileSync(join(c.path, p), "utf8");

    // Measure 1: the pairs the tree draws against the pairs the check derives.
    const mine = r.pairs(r.readTopics(md, read, PATTERNS));
    const ref = execFileSync(python, ["-I", join(here, "measure/reference_pairs.py"), c.path, standard, topicLocal, ...PATTERNS], { encoding: "utf8" })
      .split("\n").filter(Boolean).sort();
    const equal = mine.length === ref.length && mine.every((p, i) => p === ref[i]);

    // A scratch copy with three planted defects, so that the runner has verdicts to write.
    const copy = join(out, c.name);
    for (const f of files) {
      mkdirSync(dirname(join(copy, f)), { recursive: true });
      cpSync(join(c.path, f), join(copy, f));
    }
    mkdirSync(join(copy, "checks/local"), { recursive: true });
    cpSync(join(topicLocal, "topic.py"), join(copy, "checks/local/topic.py"));
    const cfg = join(copy, "checks/config.toml");
    const topicSection = `\n[topic]\nfiles = ${JSON.stringify(PATTERNS)}\nroot = "README.md"\n`;
    existsSync(cfg) ? appendFileSync(cfg, topicSection) : writeFileSync(cfg, `extends = "reader-ergonomics"\n${topicSection}`);
    writeFileSync(join(copy, "decisions/9999-orphan.md"), "# Orphan\n\nA topic that nothing lists.\n");
    appendFileSync(join(copy, "README.md"), "\n[a broken link](nowhere/at-all.md)\n");
    appendFileSync(join(copy, "design/" + md.find((f) => f.startsWith("design/"))!.slice(7)), "\n# A second title\n");
    execFileSync("git", ["init", "-q"], { cwd: copy });
    execFileSync("git", ["add", "-A"], { cwd: copy });

    let text = "";
    try {
      text = execFileSync(python, [join(standard, "run.py"), copy, "--tiers", "program", "--judge", "flag"], { encoding: "utf8", maxBuffer: 1 << 28 });
    } catch (e) {
      text = String((e as { stdout?: string }).stdout ?? ""); // a non-zero exit is the runner reporting errors
    }
    const verdictsFile = join(copy, "checks/out/verdicts.txt");
    mkdirSync(dirname(verdictsFile), { recursive: true });
    writeFileSync(verdictsFile, text);

    // Measure 2: verdicts in the file against diagnostics, each on the named line.
    const inFile = text.split("\n").filter((l) => /^(error|warning)\s/.test(l)).length;
    const copyFiles = new Set(listFiles(copy));
    const verdicts = r.parseVerdicts(text);
    const placed = r.place(verdicts, (p) => copyFiles.has(p), "README.md");
    const onLine = placed.filter((p) => p.line === (p.verdict.line ?? 1) && (p.path === p.verdict.path || !copyFiles.has(p.verdict.path))).length;

    // Measure 3: time from the file's change to the diagnostics, the full refresh the extension does.
    const refresh = () => {
      const texts = (p: string) => readFileSync(join(copy, p), "utf8");
      const topics = r.readTopics([...copyFiles].filter((f) => f.endsWith(".md")), texts, PATTERNS);
      const v = r.parseVerdicts(readFileSync(verdictsFile, "utf8"));
      r.place(v, (p) => copyFiles.has(p), "README.md");
      return topics.length;
    };
    const times: number[] = [];
    for (let i = 0; i < 30; i++) {
      const t = await new Promise<number>((done) => {
        const w = watch(verdictsFile, () => {
          refresh();
          w.close();
          done(performance.now() - t0);
        });
        const t0 = performance.now();
        setTimeout(() => writeFileSync(verdictsFile, text + (i % 2 ? "" : "\n")), 0);
      });
      times.push(t);
    }
    report.push({
      corpus: c.name, markdownFiles: md.length, topics: new Set(mine.map((p) => p.split(">")[1])).size + 1,
      pairsMine: mine.length, pairsCheck: ref.length, pairsEqual: equal,
      verdictLinesInFile: inFile, diagnostics: placed.length, onNamedLine: onLine,
      refreshMsMedian: +median(times).toFixed(1), refreshMsMax: +Math.max(...times).toFixed(1),
    });
  }
  console.log(JSON.stringify(report, null, 2));
}

void run();
