# 0002: Kilo Code as the baseline, built beside

**Decision:** The baseline is the open extension Kilo Code, and this repository builds beside all extensions, adding only the tree of topics, the verdicts in place and the list of the person's questions.

**Status:** accepted, 2026-11-02. **Shape:** [decision record](https://github.com/Tewf/reader-ergonomics/blob/65e42472e2d4cbfd994c2a86e95a47e5dc7301ca/shapes/decision-record.md).

## Context

- The first job of this repository is a review that ends by naming a baseline ([the review](../evidence/state-of-the-art/README.md)).
- Three open extensions were read in source. None shows a tree of topics or a verdict beside what it checked ([review](../evidence/state-of-the-art/review.md)).
- Kilo Code holds a question tool with options and a memory kept as files. Cline holds a question tool and a memory by convention. Continue holds rules files only.
- Roo Code and the Copilot Chat extension are archived.

## Decision

- Baseline: Kilo Code, MIT, version 7.8.25 of its extension, active on 2026-11-02.
- Position: beside all. The tree view and the diagnostics list are interfaces of the editor, so they need no agent extension.
- Considered: Cline, the second choice, because its memory is a convention and its source shows no plugin interface. Continue, because it holds the fewest parts. Building on a fork, because it ties this repository to one project's internal changes.

## Consequences

- The scope of what is built shrinks to what no extension has.
- The method reaches the agent through files it already reads: rules, memory and the brief.
- **Bad:** the choice rests on a first pass. The memory package was read for file names, not for how a person edits it, and the brief feature was not read in Kilo Code. The baseline is reopened if either fails ([baseline](../evidence/state-of-the-art/baseline.md)).
- **Bad:** the baseline can be archived, as two others were in 2026.

## See also

[Decisions](README.md); [position](../evidence/state-of-the-art/position.md); [0001](0001-a-repository-of-its-own.md).
