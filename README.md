# AI-augmented IDE

[![Checks against reader-ergonomics](https://github.com/Tewf/ai-augmented-ide/actions/workflows/checks.yml/badge.svg)](https://github.com/Tewf/ai-augmented-ide/actions/workflows/checks.yml)
[![Site](https://github.com/Tewf/ai-augmented-ide/actions/workflows/pages.yml/badge.svg)](https://tewf.github.io/ai-augmented-ide/)

The software that implements [ai-augmented-project](https://github.com/Tewf/ai-augmented-project) inside the editor, as an
**extension** of VS Code. It shows the person their project as topics, the checkers' verdicts where they stand, and the
questions that are theirs to answer. It hands the model what the method says it is handed. Open source, and built on
an open extension where one already does part of the job.

This page in French: [README.fr.md](README.fr.md).

> **Status (2026-11-02):** the review of the state of the art is written and the baseline is named; nothing is built, and
> nothing will be until the design of ai-augmented-project is approved. The name is provisional. It is not an official standard, not a peer-reviewed study and not a new result.
>
> **How it is made:** with Claude, an AI assistant by Anthropic, under the maintainer's direction, the way
> reader-ergonomics was made. Corrections are welcome as issues.

## Where it sits

![ai-augmented-ide implements ai-augmented-project, which uses reader-ergonomics-project and reader-ergonomics-blueprint, which obey the standard and the topic.](where-it-sits.svg)

<details>
<summary>Graphviz source</summary>

```dot
// Where ai-augmented-ide sits. Colours: AI-augmented family green, reader-ergonomics family blue, the bridge orange,
// each named in its box; this repository has the thick border.
digraph where_it_sits {
  graph [rankdir=TB, nodesep=0.45, ranksep=0.5, bgcolor="white", pad=0.2, fontname="Inter"];
  node  [shape=box, style="rounded,filled", fontname="Inter", fontsize=13, margin="0.2,0.1", penwidth=1.5, fontcolor="#1F2328"];
  edge  [fontname="Inter", fontsize=11, color="#3D434B", fontcolor="#55575F", penwidth=1.3, arrowsize=0.8];
  IDE [label=<<b>ai-augmented-ide</b><br/><font point-size="11" color="#55575F">AI-augmented family: the tool inside the editor</font>>, fillcolor="#E6F2EA", color="#2E7D4F", penwidth=2.6];
  AP  [label=<<b>ai-augmented-project</b><br/><font point-size="11" color="#55575F">AI-augmented family: what the tool implements</font>>, fillcolor="#E6F2EA", color="#2E7D4F"];
  P   [label=<<b>reader-ergonomics-project</b><br/><font point-size="11" color="#55575F">reader-ergonomics family: the steps</font>>, fillcolor="#E8EEF8", color="#2F5DA8"];
  BP  [label=<<b>reader-ergonomics-blueprint</b><br/><font point-size="11" color="#55575F">the bridge: reasoning checked</font>>, fillcolor="#FBEDE4", color="#B4541A"];
  RE  [label=<<b>reader-ergonomics, reader-ergonomics-topic</b><br/><font point-size="11" color="#55575F">the standard and the unit of writing</font>>, fillcolor="#E8EEF8", color="#2F5DA8"];
  IDE -> AP [label=" implements"];
  AP -> P [label=" uses"];
  AP -> BP [label=" uses"];
  P -> RE [label=" obeys"];
  BP -> RE [label=" obeys"];
}
```

</details>

- **It implements [ai-augmented-project](https://github.com/Tewf/ai-augmented-project)** and nothing of its own: a
  choice about the method is made there, with a record, then implemented here.
- **It obeys [reader-ergonomics](https://github.com/Tewf/reader-ergonomics/blob/b9732b9814c71768f722691f3c5049ec2b8ed378/standard.md)** (v1.19.2) for its documents and runs its checks in CI; the code
  will follow [reader-ergonomics-software-design](https://github.com/Tewf/reader-ergonomics-software-design): a design
  document before building, a record per choice.
- **It links down only.** The family's map is [ai-augmented](https://github.com/Tewf/ai-augmented).

## Scope

| | What | Why |
|---|---|---|
| in | a VS Code extension, open source | the editor is where the person, the model and the machine already meet |
| in | what it shows the person: the project as a tree of topics, each checker's verdict beside its part, the questions that are theirs | the person does not get lost, and decides only what is theirs |
| in | what it hands the model: the standing instructions, the memory, the brief of the step, as the method sets them | the method decides the content; the tool delivers it |
| in | what it runs: the checks of the machine, before any model reads the output | the oracle comes first |
| later | several agents on one project | [ai-augmented-agents](https://github.com/Tewf/ai-augmented-agents) first, then an implementation |
| out | the method | [ai-augmented-project](https://github.com/Tewf/ai-augmented-project) |
| out | a model, a proof assistant, a checker of its own | others build them; this calls them |

## The first job: a review of the state of the art

Done as a first pass, in [evidence](evidence/state-of-the-art/). It follows the order of a thesis review, and it is finished when it can name the baseline: the open
extension this one builds on, or beside, with the reason.

1. **Frame:** what the field calls an editor extension that drives a coding agent, and which ones are open.
2. **Review:** the open extensions first, read in their source and their documentation. What each already does of the
   method: project as a tree, verdicts in place, questions to the person, memory, briefs, measured where anyone
   measured it. The closed ones are comparators only.
3. **State of the art, and the case against:** what no extension does, and what practitioners report goes wrong.
4. **Position:** build on one, or beside all; the design document of ai-augmented-project decides what is left to build.
5. **Baseline:** one open extension, named, with the gap between it and the method listed.

## Questions the review must answer

- **What exists.** Which parts of the method do the open extensions already implement, so that this builds only the
  rest?
- **On or beside.** Is one of them a base to extend, by licence and by architecture, or is a thin tool beside them
  cheaper to keep?
- **The verdicts.** How does an editor show a checker's verdict where the claim stands, and what does the person do
  with it?
- **The person's questions.** How are the decisions that are the person's shown, with options, so that none is asked
  twice?

## What the review found

A first pass of 28 sources, read on 2026-11-02 ([evidence](evidence/state-of-the-art/)).

- **No open extension shows the project as a tree of topics, or a verdict beside what it checked.** Cline, Continue and Kilo Code each draw one chat panel. None uses the editor's tree view. The diagnostics they read go to the model.
- **The person's questions and the memory exist in pieces.** Kilo Code has a question tool with options and a memory kept as files. Cline has a question tool and a memory by convention. Continue has rules files only.
- **The field's problem is supervision.** In 20,574 agent sessions, 91.49% of visible resolutions needed an explicit user correction (secondary, from an abstract).
- **The ground moves.** Two of the five open extensions were archived in 2026.
- **The two missing parts need no agent extension.** The editor offers a tree view and a diagnostics list to any extension.

The field calls the thing an AI IDE or an IDE coding agent. The name here matches loosely and stays.

## The baseline

**Kilo Code**, MIT, active on 2026-11-02 ([baseline](evidence/state-of-the-art/baseline.md), [decision 0002](decisions/0002-kilo-code-as-the-baseline.md)). The position is beside all: this repository adds only what no extension has.

| Feature | Kilo Code holds | Gap |
|---|---|---|
| Tree of topics | no | all of it |
| Verdict beside the thing | no | all of it |
| Questions kept apart | a question tool with options | a list apart from the output |
| Memory the person edits | files on disk | editing not tested |
| Brief passed unchanged | not read | to read |

## Check it

```sh
git clone https://github.com/Tewf/reader-ergonomics
python3 reader-ergonomics/checks/run.py path/to/this/repository
```

CI runs the same checks on every push, and a run fails on any error
([checks.yml](https://github.com/Tewf/ai-augmented-ide/blob/master/.github/workflows/checks.yml)). Every push to master
also renders the site, [tewf.github.io/ai-augmented-ide](https://tewf.github.io/ai-augmented-ide/)
([pages.yml](https://github.com/Tewf/ai-augmented-ide/blob/master/.github/workflows/pages.yml)).

## Contents

| Part | Summary |
|---|---|
| [evidence](evidence/) | the review of the state of the art, 28 sources, and the bibliography |
| [decisions](decisions/) | one record per choice that shapes this repository, each opening with the decision in one sentence |

## Licence

Code under the [Apache License 2.0](LICENSE); prose under [CC BY 4.0](LICENSES/CC-BY-4.0.txt). Reuse it as you wish,
with credit to this repository; [CITATION.cff](CITATION.cff) gives a citation if you need one.
