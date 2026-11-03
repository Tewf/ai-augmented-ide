# 0001: A repository of its own

**Decision:** The editor extension that implements the AI-augmented project method is one problem, so it gets one public repository, set up with its
scope and nothing more.

**Status:** accepted, 2026-11-02. **Shape:** [decision record](https://github.com/Tewf/reader-ergonomics/blob/4f99372093729dacf982e9174e94f6b8793c513d/shapes/decision-record.md).

## Context

- The maintainer's rule for the family: one repository per problem, and no overlap between two. A problem left inside
  a wider repository makes every user of it depend on everything else there, which is why an earlier, wider
  repository was paused.
- Six repositories of the reader-ergonomics family were set up the same way on 2026-10-29: scope first, published
  empty, the review as the first job, the name provisional until that review's frame step.
- The boundary with the neighbours is drawn on the front page's scope table. In short: the method, and every choice this one implements, stay with ai-augmented-project; several agents with ai-augmented-agents.

## Decision

- One public repository for this problem, under the family's provisional prefix, renamed when the review names it.
- At its start it holds its scope, the questions its review must answer, the checks of reader-ergonomics in CI, a
  site, and this record. Nothing of the work itself.
- It pins reader-ergonomics v1.20.0 by commit, and links down only.

## Consequences

- A later session can start from the front page alone: the scope, the first job and the questions are there.
- A fact that belongs here is linked from the neighbours, never copied; a fact that belongs to a neighbour is linked from here.
- **Bad:** a repository with a scope and no content is thin for as long as the review waits, and a rename after the
  frame step moves the address once.

## See also

[Decisions](README.md); [the front page](../README.md), where the scope and the first job are.
