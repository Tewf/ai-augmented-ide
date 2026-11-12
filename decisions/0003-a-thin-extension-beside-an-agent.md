# 0003: A thin extension beside an agent

**Decision:** The editor extension contributes views and a hand-over beside an existing agent, drives the baseline only through an optional adapter, and works with any agent that reads files.

**Status:** proposed, 2026-11-03. **Shape:** [decision record](https://github.com/Tewf/reader-ergonomics/blob/65e42472e2d4cbfd994c2a86e95a47e5dc7301ca/shapes/decision-record.md).

## Context

- The review found no tree of topics and no verdict in place in the three open extensions read ([review](../evidence/state-of-the-art/review.md)).
- The editor offers a tree view and a diagnostics list to any extension, so these parts need no agent extension.
- The baseline's manifest contributes commands to open a task and to add to the context. Whether they take an argument is not tested.

## Decision

- The core reads files and writes one brief. It needs no command of any agent.
- An adapter drives the baseline's commands and is replaceable.
- Rejected: a fork of the baseline; an agent extension of its own; a server for the editor-to-agent protocol; files and a program with no extension.
- Written in [the design](../design/extension.md), decision 1.

## Consequences

- Deleting the agent or the adapter loses a convenience, not the views.
- **Bad:** the convenience of a one-step hand-over depends on commands that one project may change or archive.

## See also

[Decisions](README.md); [the design document](../design/extension.md); [record 0002](0002-kilo-code-as-the-baseline.md).
