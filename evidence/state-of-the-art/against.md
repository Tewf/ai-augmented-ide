# Against: what the evidence does not support, and what practitioners report

Step 3 of the review, second half. It gathers the limits of [state of the art](state-of-the-art.md) and the failures people report. Terms are in [frame](frame.md).

## Answer first

- No study found measures a verdict shown in place, or a tree of topics, in an editor. The method's two distinctive parts are untested.
- The strongest trial found says AI tools slowed experienced developers.
- Specifications cost planning and review time, and they decay.
- The pool is small, read by abstract, and unreviewed.

## What practitioners report goes wrong

| Report | Source and where | Reading |
|---|---|---|
| Agents misread projects and intent, break rules, overreach and report progress inaccurately; constraint violations and inaccurate self-reports grow in share | Tang 2026, abstract (secondary) | the person must check what the agent says it did |
| Added code carries more coupling and copying, and costs review effort | Tran 2026, abstract (secondary) | a check outside the model is needed |
| Technical debt rises even when speed gains fade | Agarwal 2026a, abstract (secondary) | speed is not the measure |
| Output-only feedback does not find the cause of a bug | Wang 2026b, abstract (secondary) | an intermediate verdict is needed, which supports feature 2 |
| Specifications decay, and cost planning and review | Agarwal 2026b, abstract (secondary) | a brief must be kept in step with the code |
| A harmless-looking chain of ordinary steps in the editor produced 816 of 816 unsafe completions where single steps produced 8 of 816 | Kumar 2026, abstract (secondary) | a check must look across the workflow, not one turn |

## Limits of the evidence

| Limit | Effect on this review |
|---|---|
| Becker 2025 tested early-2025 tools on 16 people | it says nothing about 2026 tools, and nothing about verdicts in place |
| The self-report studies measure belief, and Becker 2025 shows belief and measurement can differ | feelings of better support are not evidence |
| Every preprint was read by abstract and none was checked for peer review | the figures are leads, not findings |
| Three extensions were read, each at one commit | a feature added a week later is missed |
| Two extensions are now archived, with their last pushes before this review | the base may not outlive the design |
| No practitioner blog or forum was searched | the reports above come from studies of sessions and interviews |

## What would change the position

- A study that shows a verdict in place does not help the person.
- An extension that ships a tree of topics or a verdict view.
- A change of licence or a long silence in the chosen base.

## See also

[State of the art](state-of-the-art.md); [position](position.md).
