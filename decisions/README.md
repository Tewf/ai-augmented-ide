# Decisions

One record per choice that shapes this repository. Each follows the [decision record](https://github.com/Tewf/reader-ergonomics/blob/4f99372093729dacf982e9174e94f6b8793c513d/shapes/decision-record.md) of reader-ergonomics: the
decision in one sentence under its title, then its status, context, decision and consequences.

## Contents

| Record | Summary |
|---|---|
| [0009 Choices made while building the extension](0009-choices-made-while-building-the-extension.md) | Build the extension in `extension/` as the design and the spike set it out, with eight choices the design left open |
| [0008 The spike passed three measures and two are open](0008-the-spike-passed-three-measures-and-two-are-open.md) | Keep the design as it is: the tree, the verdicts and the display passed their thresholds on both corpora, and the two measures that need the baseline and a model stay open |
| [0007 A one-day spike before any build](0007-a-one-day-spike-before-any-build.md) | A throwaway spike of one day tests the reading and the hand-over on two corpora, against thresholds fixed in advance, before any extension is built |
| [0006 The extension keeps no state and decides nothing](0006-the-extension-keeps-no-state-and-decides-nothing.md) | The extension keeps no state of its own, calls no model and decides nothing, and it runs the project's check command only when asked or on save |
| [0005 A hand-over note names the originals](0005-a-hand-over-note-names-the-originals.md) | The extension hands the model the start file and the memory index unchanged by writing a small derived brief that names them, and never copies them |
| [0004 Three views read from files](0004-three-views-read-from-files.md) | The extension shows the tree of topics, each verdict in the editor's diagnostics and a list of the person's questions, each read from files and none stored |
| [0003 A thin extension beside an agent](0003-a-thin-extension-beside-an-agent.md) | The editor extension contributes views and a hand-over beside an existing agent, drives the baseline only through an optional adapter, and works with any agent that reads files |
| [0002 Kilo Code as the baseline, built beside](0002-kilo-code-as-the-baseline.md) | The baseline is the open extension Kilo Code, and this repository builds beside all extensions, adding only the tree of topics, the verdicts in place and the list of the person's questions |
| [0001 A repository of its own](0001-a-repository-of-its-own.md) | The editor extension that implements the AI-augmented project method is one problem, so it is one repository, set up before any work on it |

## See also

[The front page](../README.md); [the design document](../design/extension.md).
