# 0005: A hand-over note names the originals

**Decision:** The extension hands the model the start file and the memory index unchanged by writing a small derived hand-over note that names them, and never copies them.

**Status:** proposed, 2026-11-03. **Shape:** [decision record](https://github.com/Tewf/reader-ergonomics/blob/65e42472e2d4cbfd994c2a86e95a47e5dc7301ca/shapes/decision-record.md).

## Context

- The method hands a session two files and nothing else ([record 0004 of the method](https://github.com/Tewf/ai-augmented-project/blob/master/decisions/0004-a-short-start-file-and-an-index.md)). It does not define a brief.
- A fact kept in two places drifts, and a text typed into a chat is not on disk for the audit.
- The baseline's rule files were not read, so loading by name is unproven for it.

## Decision

- The note holds the two paths, the lines of any failed check as the verdicts file has them, and the last lines of the decision log.
- The adapter attaches it where the agent allows; otherwise the person does.
- Rejected: a copy in the agent's rules folder; the text typed as a first message; a tool the model calls; reliance on loading by name.
- Written in [the design](../design/extension.md), decision 3.

## Consequences

- The originals stay the only copies, and the note can be deleted at any time.
- **Bad:** the agent must obey "read these first", which nothing here enforces, and the method has to adopt or replace this note.

## See also

[Decisions](README.md); [the design document](../design/extension.md); [record 0003](0003-a-thin-extension-beside-an-agent.md).
