# Changelog

Every release of this repository, and the releases it pins, newest first, in the form of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
A pin move is recorded here, not in decisions/.

## [0.2.0] - 2026-11-04

### Added

- Pinned reader-ergonomics v1.21.0 (`2e5b6f0`), from v1.20.0 (`4f99372`): duplication skips the lines a declared shape prescribes
- The extension, in `extension/`: three views (topics, verdicts, questions), the verdicts as diagnostics, five commands,
  a hand-over note written under `.ai-augmented/`, and an adapter that opens a new task in the baseline. TypeScript on
  Node 24, Apache-2.0, packaged as `ai-augmented-0.2.0.vsix`; not committed, not published.
- 18 tests of the readers under node:test and 9 of the views under the editor, both run in CI with the packaging.
- Decision record 0009, the choices made while building.

### Changed

- The front pages say the extension can be installed from a file, and show the spike's five measures run.
- Pinned reader-ergonomics v1.20.0 (`4f99372`), from v1.19.2 (`b9732b9`): the runner's verdicts file (`--out`), and hand-written llms.txt lines kept through a rebuild
- Tag v0.2.0 and a GitHub release of the same name.

## [0.1.0] - 2026-11-03

### Added

- The first release, at 0.x because nothing is shipped: a first-pass review of the state of the art (28 sources) that
  names its baseline, Kilo Code, and the position beside it.
- A design document of the extension, a thin one beside an agent, with a record per choice.
- A one-day spike of the design: its readers, a throwaway extension, 9 unit tests run in CI before the standard's
  checks, and three of five measures run and passed; two are open.
- Take it, on the front page: the shapes to copy, the pin and the one command to run.

### Changed

- Pinned reader-ergonomics v1.19.2 (`b9732b9`), unchanged since the repository's start.

## 2026-11-02

### Added

- Pinned reader-ergonomics v1.19.2 (`b9732b9`), at the repository's start: the standard's pin, link, changelog and
  decision-record checks, which this skeleton is written to pass.
