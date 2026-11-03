# 0009: Choices made while building the extension

**Decision:** Build the extension in `extension/` as the design and the spike set it out, with eight choices the design left open, each listed below.

**Status:** accepted, 2026-11-03. **Shape:** [decision record](https://github.com/Tewf/reader-ergonomics/blob/2e5b6f0c3e67d2dc8195a63cf882d46170e79a5a/shapes/decision-record.md).

## Context

- [0008](0008-the-spike-passed-three-measures-and-two-are-open.md) kept the design and left two measures open. The spike's [results](../spike/RESULTS.md) later ran them: the baseline's commands take no argument, and a small local model does not read the start file first, where two cloud models do.
- The design left several points to the build: where the topics are listed, what the runner writes, how a question is shown, how the checks are run.

## Decision

- **The topic list** is read from `[topic] files` and `root` in `checks/config.toml`. A setting overrides it, and with neither, every markdown file is a topic. This closes the follow-up of 0008.
- **The verdicts** are read from the runner's `--out` file: `kind check path:line message`, a summary line and an `exit N` line. A file without `exit N` is read as it stands.
- **Three views** are contributed: topics, verdicts and questions. The verdicts also go to the editor's diagnostics, one per line, severity from the kind. The tree view lists them so that they can be counted at a glance.
- **The questions** are read from `checks/out/needs-judgment.md`, the open `- [ ]` entries. A click opens that entry at its line. The extension writes nothing there, since the answer goes in the answers file by hand.
- **The checks** run through a child process without a shell, only when asked or, if the person sets it, on save. The command is a setting; `${verdictsFile}` stands for the verdicts file.
- **The note file** is `.ai-augmented/handover.md`. It names the start file, the memory index and, when a `brief.md` is open in the editor, that brief, and it quotes the start file's precedence sentence. `.ai-augmented/` is added to `.gitignore` on the first write.
- **The adapter** drives the baseline's New Task command only. The command takes no argument, so the note is opened and the person attaches it.
- **The editor tests** use a small runner of their own, not node:test: node:test starts a subprocess per file, and a subprocess has no `vscode` module.
- Rejected: publishing from this repository; a cache of the topics; a file decoration (left for later); the method's question queue and decision log (the method gives them no format).

## Consequences

- A project needs a check command that writes the verdicts file; the default is `python3 checks/run.py . --out ... --judge flag`, and a project whose runner lives elsewhere sets the setting.
- Published packages are the maintainer's step, with his tokens.
- The hand-over works as measured with a cloud-class model; with a small local model the person attaches the start file as well.
- **Bad:** the extension reads a subset of TOML, enough for the topic table and nothing more; a config that writes `files` in another form is not read, and the fallback is every markdown file.
- **Bad:** the views were tested in an editor on one fixture, not on a large project.

## See also

[Decisions](README.md); [the design document](../design/extension.md); [the spike's results](../spike/RESULTS.md); [the extension](../extension/README.md).
