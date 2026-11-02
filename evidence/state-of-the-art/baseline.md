# Baseline: Kilo Code

Step 5 of the review. The baseline is one open extension, named, with the gap between it and the method listed. Terms are in [frame](frame.md).

## Answer first

The baseline is **Kilo Code** (Kilo 2026), MIT, active on 2026-11-02, version 7.8.25 of its VS Code extension. It holds two of the five features in part and none of the other three.

## Facts

| Item | Value | Source |
|---|---|---|
| Licence | MIT | repository metadata |
| Archived | no | repository metadata |
| Last push | 2026-11-02 | repository metadata |
| Interface | a sidebar webview and an Agent Manager of sessions and worktrees | extension manifest |
| Question tool | options, a typed answer, a recommended option first | tool description in source |
| Memory | `project.md`, `environment.md`, `corrections.md` and decisions files, with commands to show and toggle | memory package in source |

## The gap to the five features

| Feature | Kilo Code holds | Gap |
|---|---|---|
| 1. Tree of topics | no | all of it |
| 2. Verdict beside the thing | no | all of it |
| 3. Questions kept apart | the question tool, one call at a time | a list apart from the output, so none is asked twice |
| 4. Memory the person edits | files on disk the memory package writes | editing in the interface was not tested; memory of the method's kind (topics, verdicts) is not what it keeps |
| 5. A brief unchanged | not read | whether a brief file reaches the model without rewording |

## The alternative

Cline 2026 (Apache-2.0, active) holds a question tool and a memory by convention. It was set second because its memory is the person's own discipline, not a feature, and its source shows no plugin interface.

## Reasons that could be wrong

- The memory package was read for file names and commands, not for how a person edits.
- Kilo 2026's runtime sits in a package named opencode in the same repository. Its fit was not tested.
- A comparison of the two on a task was not run. This is a first pass and builds nothing.

## What is measured against it later

A task from the method, run in the baseline alone and in the baseline with the extension of this repository, compared on the number of questions asked twice and on the corrections the person made.

## See also

[Position](position.md); [decision 0002](../../decisions/0002-kilo-code-as-the-baseline.md).
