# Results of the one-day spike

Three of the five measures of the design's decision 5 were run and passed. Two were not run, because they need the
baseline installed and a model session. Nothing in the spike is shipped.

**Date.** 2026-11-03. **Shape:** [design document](https://github.com/Tewf/reader-ergonomics-software-design/blob/48b497ba591e9d6ffc962b1d08448930fa8158de/shapes/design-document.md), decision 5 of [the design](../design/extension.md).

Terms: a **corpus** is a repository whose files the spike reads. The two corpora are this repository and the method's
repository, [ai-augmented-project](https://github.com/Tewf/ai-augmented-project). A **pair** is a topic and its parent.

## The five measures

| # | Question | Passes if (fixed in the design) | Result | Verdict |
|---|---|---|---|---|
| 1 | Does the tree agree with the topic check? | the sets of pairs are equal | 20 of 20 and 21 of 21 pairs equal | **pass** |
| 2 | Does every verdict arrive? | the counts are equal, each on the named line | 14 of 14 and 44 of 44, all on the named line | **pass** |
| 3 | Is the display fast enough? | under 2 s on both corpora | median 1.5 ms and 1.7 ms; worst 2.9 ms and 3.1 ms | **pass** |
| 4 | Do the baseline's commands take an argument? | the brief is attached in 5 of 5 trials, or the answer is no | not run | open |
| 5 | Does the agent read the originals first? | 4 of 5 sessions or more | not run | open |

## What each number is

**Measure 1.** The spike lists each corpus's markdown files and keeps those under `README.md`, `evidence/`,
`decisions/` and `design/`. The extension's reader derives the pairs. The topic check's own parent function derives
them again, on the same set. The two lists are sorted and compared.

- This repository: 24 markdown files, 21 topics, 20 pairs, equal.
- The method's repository: 25 markdown files, 22 topics, 21 pairs, equal.
- The reader re-implements the rule in TypeScript. The check is the oracle, so a drift in the check fails this measure.

**Measure 2.** Neither corpus produces a verdict today, since both pass. The spike therefore copies each corpus to a
scratch folder, plants three defects (an unlisted topic, a broken link, a second title), and writes the runner's
printed output to a verdicts file. The runner is the standard's, at the release this repository pins.

- A verdict is an `error` or `warning` line of the runner's form. Judgment lines go to the questions list.
- This repository: 14 lines, 14 diagnostics, 14 on the named line.
- The method's repository: 44 lines, 44 diagnostics, 44 on the named line.
- A line without a number sits on line 1. A file that does not exist sits on the root topic. Both rules are unit-tested.

**Measure 3.** Time from a write to the verdicts file to the finished refresh: the watcher fires, then every topic
file is read, the tree rebuilt and the diagnostics placed. 30 trials per corpus.

- Median 1.5 ms and 1.7 ms. Worst 2.9 ms and 3.1 ms. The threshold is 2000 ms.
- It excludes the editor's own drawing, and the time the runner takes to produce the file (a few seconds).
- Both exclusions are the editor's and the runner's, not the extension's, and the margin is three orders of magnitude.

**Measures 4 and 5.** Not run.

- Measure 4 needs the baseline extension installed in the editor.
- Measure 5 needs five model sessions, which means a signed-in account.
- The spike sends no identity to any service, so both stay open.
- They send the design back to decision 3 only if they fail, and they have not been tried.

## What runs and what is rough

| Part | State |
|---|---|
| The readers: topics, verdicts, judgments, placement, note | run, 9 unit tests pass |
| The tree view, the diagnostics, the questions list | compiled against the editor's types; not opened in an editor |
| The hand-over note | written by a command; its content is unit-tested |
| The method's question queue | not read: the method gives it no format yet |
| The choice of an option from the queue, the decision log line | not built |
| An adapter to the baseline | not built |

## What the spike showed

- The tree can be read from files and agrees with the check on both corpora. Decision 2 stands on this point.
- The verdicts need a file, and the runner does not write one. The spike used redirected output, as the design says.
- The spike needed a topic list. Neither corpus configures one, so the spike took a setting, `topicFiles`. Decision 2
  names the check's configuration as the source; the check's own list would remove the second reading.
- Without an editor session the spike cannot say how the views look. That is the first thing to do before a build.

## Run it

```sh
cd spike
npm install
npm test
STANDARD=../checks/out/standard/checks PYTHON=python3 npm run measure
```

`STANDARD` is the standard's `checks` folder at the pinned release, extracted as `AGENTS.md` says. `PYTHON` must have
the runner's libraries. `TOPIC` and `METHOD` may name the topic extension's `checks/local` folder and the method's
repository, when they are not beside this one.
