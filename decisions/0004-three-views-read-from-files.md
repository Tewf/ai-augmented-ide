# 0004: Three views read from files

**Decision:** The extension shows the tree of topics, each verdict in the editor's diagnostics and a list of the person's questions, each read from files and none stored.

**Status:** proposed, 2026-11-03. **Shape:** [decision record](https://github.com/Tewf/reader-ergonomics/blob/2e5b6f0c3e67d2dc8195a63cf882d46170e79a5a/shapes/decision-record.md).

## Context

- The three open extensions read each draw one webview, which cannot place a diagnostic in a file.
- The topic check defines a topic's parent by the folder above it; the runner prints one line per finding; the checks leave open questions in an answers stub.
- The method gives the question queue, the decision log and the verdicts a writer and a reader but no format.

## Decision

- The tree follows the topic check's parent rule. Verdicts become diagnostics at the line named. Questions come from the answers stub and the method's queue.
- A judgment entry is answered by the person in the answers file; the extension opens it and writes nothing.
- Rejected: one webview dashboard; verdicts in the output panel; verdicts from CI; questions in the chat panel; the tree from the Contents tables.
- Written in [the design](../design/extension.md), decision 2.

## Consequences

- Every line shown traces to a file and a line.
- **Bad:** the runner writes no verdicts file today, and the tree reads the topic rule a second time, so a change in the check must reach the extension.

## See also

[Decisions](README.md); [the design document](../design/extension.md); [record 0003](0003-a-thin-extension-beside-an-agent.md).
