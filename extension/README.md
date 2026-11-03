# AI-augmented extension

A VS Code extension that shows a project as a tree of topics, each check's verdict where it stands, and the questions that are the person's, and writes a hand-over note for the agent.

It reads files, keeps no state, calls no model and decides nothing. Install it, its settings and its model-size condition are in the [front page](../README.md).

## Contents

| Part | Summary |
|---|---|
| [src/core](src/core/) | the readers: topics, verdicts, questions, the hand-over note, the check runner; no editor import |
| [src](src/) | the editor side: the three views, the diagnostics, the commands and the one adapter |
| [test](test/) | the readers under node:test, the views under the editor on a fixture workspace |
