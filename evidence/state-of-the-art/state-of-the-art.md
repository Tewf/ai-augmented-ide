# State of the art: what exists and what the studies say

Step 3 of the review, first half. The case against is in [against](against.md). Terms are in [frame](frame.md). Every figure from a preprint is read from its abstract, so each is secondary.

**Shape:** [state of the art](https://github.com/Tewf/reader-ergonomics-review/blob/a7f405f26f14cd188291e2a86b630121c4302a94/shapes/state-of-the-art.md)

## Answer first

- The open extensions share a shape: one chat webview, an agent loop, rules files, approvals.
- Two parts of the method are not in any of the three read: the tree of topics and the verdict in place.
- Two parts exist in pieces: the question with options (Kilo 2026) and the memory as files (Kilo 2026, Cline 2026 by convention).
- The studies point at supervision as the bottleneck, which is where the method places its effort.

## What exists

| Part of the method | Who has it | Strength of the finding |
|---|---|---|
| Question with options, apart from output | Kilo 2026 | read in source |
| Memory as files the person can open | Kilo 2026; Cline 2026 by convention | read in source and documentation |
| Standing instructions as files | Cline 2026; Continue 2026 | read in source and documentation |
| Editor to agent protocol | ACP 2026 | repository description only |
| Tools for the model | MCP 2026 | repository description only |
| A specification before the code | Spec Kit 2026; OpenSpec 2026 | repository descriptions only; outside the editor |

## What the studies say

| Claim | Source and where | Grade |
|---|---|---|
| Allowing AI tools increased completion time by 19% for 16 experienced developers on 246 tasks, while they believed it saved about 20% | Becker 2025, abstract (secondary) | measured, with caveat: small sample, early-2025 tools |
| Work shifts from creating to verifying; 84% report better productivity while a quarter report a worse experience in at least one dimension (14% to 27%, matched cohort of 95) | Vella 2026, abstract (secondary) | supported with caveat: self-report |
| In 20,574 agent sessions, 91.49% of visible resolutions needed an explicit user correction | Tang 2026, abstract (secondary) | supported with caveat: observational |
| After agents were adopted, static-analysis warnings rose about 18% and cognitive complexity about 39% | Agarwal 2026a, abstract (secondary) | supported with caveat: open-source repositories, matched controls |
| Targeted feedback to the model cut targeted static-analysis warnings by 11.1% in 3.52 million changes | Tran 2026, abstract (secondary) | supported with caveat: one company, one language |
| Output-only feedback gave 0% full-scene success; code-level knowledge restored convergence | Wang 2026b, abstract (secondary) | supported with caveat: one task domain |
| The bottleneck moves to how people communicate with, supervise and trust agents; four dimensions: task alignment, verifiability, steerability, adaptability | Wang 2026c, abstract (secondary) | convention: a position paper |
| Real sessions mix questions, planning, review, refactoring and execution, and users switch between them | Slinko 2026, abstract (secondary) | supported with caveat: one vendor's IDEs |
| Developers want controls; 72.6% of usefulness ratings of 33 options were positive, and about a third of options were known | Koshchenko 2026, abstract (secondary) | supported with caveat: 56 developers |
| Specifications give more reliable agent behaviour at greater planning and review cost; spec and code are mostly checked when a change is complete | Agarwal 2026b, abstract (secondary) | supported with caveat: interviews and repository analysis |
| Repositories in the top third of specification quality spent 11.8% of commits on bug fixes against 20.4% in the bottom third | Claudino 2026, abstract (secondary) | supported with caveat: correlation |
| Validation hooks that check intermediate artifacts against the environment raised a judged score by 0.15 on a 1 to 5 scale | Taghavi 2026, abstract (secondary) | supported with caveat: model-judged |
| Citations in generated code trade determinism for the means to detect hallucinations | Panda 2026, abstract (secondary) | supported with caveat: two models |
| A graph of snippets could replace the file as the unit an IDE shows | Kula 2025, abstract (secondary) | convention: a vision paper |
| A specification is the contract between people and agents: accountability, verifiability, transferability | Diaz 2026, abstract (secondary) | convention: a conceptual analysis |

## What no extension does

- It shows the project as a tree of topics. The nearest is a task board in Cline 2026.
- It shows a checker's verdict where the claim stands. Diagnostics are read for the model, not shown as verdicts.
- It keeps the person's questions in a list apart from the model's output, so that none is asked twice. A question tool asks, one call at a time.
- It runs the machine's checks before a model reads the output, as the method asks. Not tested in source; the three extensions run commands the model chooses.

The last line is an absence of evidence in the files read, not a proof of absence.

## See also

[Review](review.md); [against](against.md); [position](position.md).
