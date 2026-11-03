# Results of the one-day spike

All five measures of the design's decision 5 were run. Nothing in the spike is shipped.

- Measures 1 to 3 passed.
- Measure 4 answered no, which the design provides for.
- Measure 5 failed on a local model, and the design says that sends it back to decision 3.

**Date.** 2026-11-03. **Shape:** [design document](https://github.com/Tewf/reader-ergonomics-software-design/blob/48b497ba591e9d6ffc962b1d08448930fa8158de/shapes/design-document.md), decision 5 of [the design](../design/extension.md).

Terms: a **corpus** is a repository whose files the spike reads. The two corpora are this repository and the method's
repository, [ai-augmented-project](https://github.com/Tewf/ai-augmented-project). A **pair** is a topic and its parent.

## The five measures

| # | Question | Passes if (fixed in the design) | Result | Verdict |
|---|---|---|---|---|
| 1 | Does the tree agree with the topic check? | the sets of pairs are equal | 20 of 20 and 21 of 21 pairs equal | **pass** |
| 2 | Does every verdict arrive? | the counts are equal, each on the named line | 14 of 14 and 44 of 44, all on the named line | **pass** |
| 3 | Is the display fast enough? | under 2 s on both corpora | median 1.5 ms and 1.7 ms; worst 2.9 ms and 3.1 ms | **pass** |
| 4 | Do the baseline's commands take an argument? | the brief is attached in 5 of 5 trials, or the answer is no and the person attaches it | attached in 0 of 5 for New Task and 0 of 5 for Add to Context (0 of 10 more with a file address) | **no**: the person attaches the note |
| 5 | Does the agent read the originals first? | 4 of 5 sessions or more | 0 of 5 (first reply) and 2 of 5 (first turn), one local model | **fail** |

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

**Measure 4.** Kilo Code 7.8.18, on 2026-11-03, no model and no sign-in involved.

- The commands are `kilo-code.new.plusButtonClicked` (New Task) and `kilo-code.new.addToContext` (Add to Context).
- Their handlers in the installed `dist/extension.js` take no parameter. New Task sends a message to the chat and
  nothing else. Add to Context reads the active editor's non-empty selection and ignores any argument.
- The trials ran the real extension in a separate editor window with a scratch profile. A driver extension
  (`measure/kilo-trials/`) called each command five times with the note's path as a string, then five times with it as a
  file address. Nothing was open in the editor.
- Every call returned without error. After each one the driver took a screenshot of the window and compared the chat's
  input area with the empty state. All 20 were identical to the empty state, with no attachment.
- Control: the note open with its text selected, and the command called with no argument. The chat then showed
  "Context (1)" with the note. The command attaches a selection, never a path.
- The answer is no. The person attaches the note, which is how measure 5 starts its sessions.

**Measure 5.** Kilo Code 7.8.18 on 2026-11-03, one local model, no sign-in, no cloud key.

- Each session is a new `kilo run` of the baseline's own binary. The note is attached as a file, with the message
  "Start from the attached hand-over note."
- Each session ran in a fresh copy of a small project (`fixtures/project`). It holds a start file in the method's
  shape and a memory index, and the note names both by path.
- The model is `qwen2.5:7b-instruct` through a local model server, OpenAI-compatible, with a 32768-token context. The baseline's own prompt
  is about 28000 tokens, so the service's default of 4096 cut the prompt away; a second server on another port
  carried the larger context.
- The conversations were read from the baseline's database (`message` and `part` tables), not from task folders.
- A command is cited when a text holds one of the start file's three commands in full. Three counts were fixed
  before the five sessions were run:

| Count | What it asks | Sessions |
|---|---|---|
| First reply | the first text the agent wrote cites a command | **0 of 5** |
| First turn | any text before the agent first stopped cites a command | 2 of 5 |
| Whole session | any text of the session cites a command | 2 of 5 |

- The agent wrote a sentence before it opened any file in all five sessions. In sessions 1 and 2 it then read the
  start file and listed its commands. In sessions 3 to 5 it summarised the note and never opened the start file.
- Both counts are under the threshold of 4 of 5, so the measure fails whichever is read.
- A first batch used a scratch folder with a long random path. The model garbled the path while copying it in all five
  sessions, so the files "did not exist". That batch is discarded as an error of the setup and also scored 0 of 5; its
  data is kept with the others. The counted batch ran in a short path.
- A second model, `qwen3:8b`, ran the same five sessions: 0 of 5 on all three counts. Two sessions read the start file
  first and did not cite a command, and two ended on a context overflow.
- Limits: one 7B model and then one 8B model, five sessions each, the baseline's default agent, no cloud model. A
  stronger model may do better. The measure says what this setup does, not what the baseline can do.
- The sessions' data (one file per session, and the printout) is in the job folder, not in this repository.

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
- The baseline's two commands do not take the note's path, so the person attaches the note (measure 4).
- Handed the note, a small local model reads the start file first in 2 of 5 sessions at best (measure 5). The note
  names the originals, and the agent did not always open them. Decision 3 is where this goes back to.
- Without an editor session the spike cannot say how the views look. That is the first thing to do before a build.
  The baseline's window was opened for measure 4, the spike's own views were not.

## Run it

```sh
cd spike
npm install
npm test
STANDARD=../checks/out/standard/checks PYTHON=python3 npm run measure
```

Measures 4 and 5 need the baseline installed. Measure 4 starts the editor with `measure/kilo-trials` as an extension
under development, in a scratch profile, and takes a window screenshot after each call. Measure 5 is
`measure/kilo-sessions/run.sh WORKDIR`, which says in its header what the local server needs.

`STANDARD` is the standard's `checks` folder at the pinned release, extracted as `AGENTS.md` says. `PYTHON` must have
the runner's libraries. `TOPIC` and `METHOD` may name the topic extension's `checks/local` folder and the method's
repository, when they are not beside this one.
