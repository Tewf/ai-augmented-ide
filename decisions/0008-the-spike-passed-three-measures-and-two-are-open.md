# 0008: The spike passed three measures and two are open

**Decision:** Keep the design as it is. Three measures passed on both corpora. The two that need the baseline and a model stay open until they can be run.

**Status:** accepted, 2026-11-03. **Shape:** [decision record](https://github.com/Tewf/reader-ergonomics/blob/b9732b9814c71768f722691f3c5049ec2b8ed378/shapes/decision-record.md).

## Context

- [0007](0007-a-one-day-spike-before-any-build.md) fixed five measures and their thresholds before any code.
- The spike ran in [spike/](../spike/), with the numbers in [RESULTS.md](../spike/RESULTS.md).
- Two measures need things the spike does not have: the baseline installed in an editor, and five signed-in model sessions.

## Decision

- Measures 1 to 3 passed.
- The pairs are equal: 20 of 20 and 21 of 21.
- The verdicts sit on their lines: 14 of 14 and 44 of 44.
- A refresh took 3.1 ms at worst, against a limit of 2 s.
- Measures 4 and 5 are open, not failed. Decision 3 is neither confirmed nor sent back.
- The tree takes its topic list from a setting. The design said the check's configuration; neither corpus has one, so that stays a follow-up.
- Rejected: counting the open measures as passed; running them with an account the spike has no right to use.

## Consequences

- Decisions 2 and 4 hold on the evidence of two corpora. Both are small and both pass the checks they are read for.
- A build still waits for measures 4 and 5, and for the method's approval.
- **Bad:** the views were compiled and unit-tested but not opened in an editor, so how they look is untested.
- **Bad:** the verdicts file was produced by redirecting the runner's output, with three defects planted, since neither corpus fails today.

## See also

[Decisions](README.md); [the design document](../design/extension.md); [the results](../spike/RESULTS.md).
