# 0006: The extension keeps no state and decides nothing

**Decision:** The extension keeps no state of its own, calls no model and decides nothing, and it runs the project's check command only when asked or on save.

**Status:** proposed, 2026-11-03. **Shape:** [decision record](https://github.com/Tewf/reader-ergonomics/blob/b9732b9814c71768f722691f3c5049ec2b8ed378/shapes/decision-record.md).

## Context

- The method's decision 5 says the extension keeps no state, so that no fact lives in two places and any editor can read the files.
- A model that sorts questions, or a default applied after a delay, decides for the person ([the method's record 0003](https://github.com/Tewf/ai-augmented-project/blob/master/decisions/0003-the-model-decides-nothing-unchecked.md)).

## Decision

- Its settings are file paths in the workspace settings. Its outputs are the views, a decision log line, the brief and a command to the agent.
- It shows a default and never applies it.
- Rejected: a cache of the parsed tree; a model that summarizes questions; a default after a delay; a background scheduler.
- Written in [the design](../design/extension.md), decision 4.

## Consequences

- A person can remove the extension and keep the project whole.
- **Bad:** large projects are read again at each change, and a stale view is the person's to refresh.

## See also

[Decisions](README.md); [the design document](../design/extension.md); [record 0003](0003-a-thin-extension-beside-an-agent.md).
