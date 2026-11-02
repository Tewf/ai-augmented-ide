# Protocol: how the pool was built

A first pass, run on 2026-11-02. Terms are in [frame](frame.md); the pool is in [sources](sources.md).

## Why grey literature

The tools change monthly and the papers lag. Garousi 2019 asks whether the formal literature alone can answer; here it cannot. Licence, activity and features are facts of repositories and their documentation. So the pool mixes both kinds.

## Searches

| Where | What was run | Result |
|---|---|---|
| Repository host, by name | 17 repositories: the extensions, the protocols, the spec-driven kits, the terminal agents | licence, archive flag and last push read for each |
| Preprint server, 4 strings | AI coding assistants with productivity or verification; coding agents with IDE or human-agent; experienced developers with AI tools; spec-driven development with agent context files | 37 records seen, 16 kept |
| Repository issues, 2 strings | "tree view" in one project, "memory" in another | read, not used as evidence |
| Source reading | the three open extensions that are alive, shallow copies of their default branches | see [review](review.md) |

- No survey of open editor extensions for coding agents was found in the preprint strings. The nearest is Wang 2026c, a position paper.
- Zero surveys on this exact topic means the strings may be wrong, not that none exists. This is a first pass.
- The third string returned one useful record in five. It was stopped there.

## Rules

- Open extensions first, read in source. Closed ones are comparators, one line each, from repository metadata only.
- A number read from an abstract is marked (secondary). A number read in source or in repository metadata is not.
- A grey source is a repository or its documentation. No blog post, forum thread or video is used as support, so no grey source falls below the threshold of Garousi 2019.
- Every figure was re-read against its abstract before it was written here.

## Not searched

- Other databases: Semantic Scholar, OpenAlex, the ACM and IEEE libraries.
- Forums, blogs, videos and the editor's marketplace pages.
- Editors other than VS Code, and the JetBrains plugins.
- The source of the two archived extensions, Roo 2026 and Copilot Chat 2026.
- Closed tools' own documentation.
- Any extension that speaks the Agent Client Protocol.

## See also

[Frame](frame.md); [sources](sources.md).
