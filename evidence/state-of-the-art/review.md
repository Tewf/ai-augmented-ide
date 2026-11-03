# Review: what each open extension does of the method

Step 2 of the review. The three live open extensions were read in the source of their default branches on 2026-11-02. Terms are in [frame](frame.md).

**Shape:** [review](https://github.com/Tewf/reader-ergonomics-review/blob/a7f405f26f14cd188291e2a86b630121c4302a94/shapes/review.md)

## Answer first

- None of the three contributes a tree view or shows a verdict beside what it checked.
- Kilo Code holds the most: a question tool with options and memory kept as markdown files.
- Cline holds a question tool and, by convention, a memory in project files.
- Continue holds rules files only.

## What was read

| Key | Version | What was searched in the source |
|---|---|---|
| Cline 2026 | 4.1.26 | the extension manifest; tree view and diagnostics calls; the question tool; the documentation pages for rules and memory |
| Continue 2026 | 1.3.40 | the extension manifest; tree view and diagnostics calls; the tool definitions; the rules page |
| Kilo 2026 | 7.8.25 | the extension manifest; tree view and diagnostics calls; the question tool; the memory package |

Roo 2026 and Copilot Chat 2026 are archived and were not read in source. Their cells say so.

## The five features

Each cell is a finding from the source, or "not read".

| Feature | Cline 2026 | Continue 2026 | Kilo 2026 | Roo 2026; Copilot Chat 2026 |
|---|---|---|---|---|
| 1. Project as a tree of topics | no. One sidebar webview; no tree view created by the extension or its SDK. A stub file for a standalone runtime names the call and logs that it is stubbed | no. One webview, one console webview; no tree view call | no. One sidebar webview and an Agent Manager of sessions and worktrees; no tree view call in the extension | not read |
| 2. Verdict beside the thing | no. Reads the editor's diagnostics to hand to the model; shows no verdict view | no. One method reads diagnostics for the model | no. Diagnostics are read by the code actions | not read |
| 3. Questions kept apart | partly. A question tool exists and has its own handler, not a plain tool row; its options were not read | no question tool among the tool definitions | yes. A question tool with options, a typed answer, and a recommended option first | not read |
| 4. Memory the person can read and edit | partly, by convention. The documentation tells the person to keep a Memory Bank of markdown files in the project | no memory. Rules files only | yes for reading: a memory package writes `project.md`, `environment.md`, `corrections.md` and decisions files, with commands to show and toggle it. Editing in the interface was not tested | not read |
| 5. A brief passed unchanged | partly. Rules files are standing instructions; the brief of a step is typed by the person | partly. Rules in `.continue/rules` are joined into the system message; the order is shown in the toolbar | not read | not read |

## What else the reading found

- Cline 2026 ships a Kanban board of task cards that can be linked. It is the nearest thing to a project view. It is a board of tasks, not a tree of topics, and it runs outside the sidebar.
- Kilo 2026 keeps its runtime in a package named opencode inside the same repository. An outside extension could talk to that runtime. This was seen in the tree, not tested.
- Continue 2026 has a default branch last changed on 2026-07-21, so its activity is lower than its last push suggests.
- No plugin interface was found in Cline's source, so a feature could not be added to it from outside except through its rules and tools.

## Comparators

| Key | One line |
|---|---|
| Copilot Chat 2026 | the chat extension of the editor's vendor; its repository is archived, its code now sits in the editor's own repository |
| Codex 2026 | a terminal agent, not an extension |
| Aider 2026 | a terminal agent, Apache-2.0 |

## See also

[State of the art](state-of-the-art.md); [against](against.md); [baseline](baseline.md).
