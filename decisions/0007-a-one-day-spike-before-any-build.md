# 0007: A one-day spike before any build

**Decision:** A throwaway spike of one day tests the reading and the hand-over on two corpora, against thresholds fixed in advance, before any extension is built.

**Status:** proposed, 2026-11-03. **Shape:** [decision record](https://github.com/Tewf/reader-ergonomics/blob/b9732b9814c71768f722691f3c5049ec2b8ed378/shapes/decision-record.md).

## Context

- Four parts of the design have never run together: the tree, the verdicts, the questions and the hand-over.
- Two questions can stop the design and are cheap to try: whether the tree agrees with the topic check, and whether the baseline's commands take an argument.

## Decision

- Five measures: agreement of the tree with the check, verdicts shown against verdicts in the file, display time, the commands' argument and whether the agent reads the originals first.
- The thresholds are provisional and written in the design before the spike runs.
- Rejected: build then test; a paper review of the source; a spike of a week.
- Written in [the design](../design/extension.md), decision 5.

## Consequences

- A failed measure sends the design back to the decision it tests.
- **Bad:** the spike shows the design can be built, not that it helps; that comparison is a later task against the baseline.

## See also

[Decisions](README.md); [the design document](../design/extension.md); [the baseline page](../evidence/state-of-the-art/baseline.md).
