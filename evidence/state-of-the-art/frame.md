# Frame: the problem and its names

Step 1 of the review, run on 2026-11-02. It states the problem, gives the field's names for it and defines each term once.

**Shape:** [frame](https://github.com/Tewf/reader-ergonomics-review/blob/a7f405f26f14cd188291e2a86b630121c4302a94/shapes/frame.md)

## The problem in one sentence

Which open extension of a code editor already drives a coding agent in the way the method asks, and which one is the base to build on or beside.

## What the field calls it

| The repository's word | The field's word | Where met |
|---|---|---|
| AI-augmented IDE | **AI IDE**, set against autonomous agents | Agarwal 2026a |
| extension that drives a coding agent | **IDE coding agent**, or coding agent in IDE and CLI workflows | Kumar 2026; Tang 2026 |
| editor to agent link | **Agent Client Protocol**, "a protocol for connecting any editor to any agent" | ACP 2026 |
| brief of a step | **specification** in **spec-driven development** | Agarwal 2026b; Claudino 2026 |

The repository's name matches the field loosely. "AI IDE" is the field's term for the product class; this repository builds an extension, not an editor. The name stays, as the brief asks.

## Names

| Term | Meaning here | Source |
|---|---|---|
| **agent extension** | an editor extension in which a model reads files, edits them and runs commands for the person | Cline 2026; Kilo 2026 |
| **open** | a licence the Open Source Initiative approves, and source on a public repository | gh metadata, read 2026-11-02 |
| **tree view** | the editor's native panel that shows a tree the person navigates, apart from the file explorer | VS Code 2026 (the TreeDataProvider interface) |
| **webview** | a panel that draws its own web page; the three extensions read in source draw their whole interface in one | Cline 2026; Continue 2026; Kilo 2026 |
| **diagnostics** | the editor's list of errors and warnings per file | VS Code 2026 |
| **verdict** | the result of a check (a test, a linter, CI) shown beside the thing it checked | the repository's front page |
| **question tool** | a tool the model calls to ask the person, with options | Kilo 2026 |
| **rules file** | a markdown file of standing instructions the extension adds to the model's prompt | Cline 2026; Continue 2026 |
| **memory** | notes kept across sessions that the person can open as files | Kilo 2026 |
| **spec-driven development** | writing a specification, a plan and tasks before the agent writes code | Agarwal 2026b |
| **archived** | a repository its owner has made read-only | gh metadata |

## The five features of the method

The front page names them. Each is tested in [review](review.md).

1. The project is shown as a tree of topics the person navigates, not only a file tree.
2. A check's verdict is shown beside the thing it checks.
3. The questions only the person can answer are kept apart from the model's output.
4. A memory is kept across sessions, and the person can read and edit it.
5. A written brief for a step reaches the model unchanged.

## See also

[Protocol](protocol.md); [review](review.md).
