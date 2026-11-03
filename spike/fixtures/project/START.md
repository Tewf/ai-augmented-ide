# Start file

## Commands

- `python3 -m unittest discover -s tests` runs the tests.
- `python3 tools/lint_notes.py` checks the notes.
- `make verify-ledger` rebuilds the ledger and compares it with `ledger.expected`.

## Conventions

- Amounts are integers in cents, never floats.
- A file name starts with the date, `2026-11-03_name.md`.

## Precedence

A rule in this file wins over a memory file, and a memory file wins over a guess.

## Pointers

- Changing the ledger: read `src/ledger.py` and `memory/ledger-rounding.md`.
- Adding a note: read `memory/note-naming.md`.
