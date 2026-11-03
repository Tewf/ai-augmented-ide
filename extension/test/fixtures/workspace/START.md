# Ledger: start file

## Commands

- `python3 -m unittest discover -s tests` runs the tests.
- `make verify-ledger` rebuilds the ledger and compares it with `ledger.expected`.

## Conventions

- Amounts are integers in cents, never floats.

## Precedence

A rule in this file wins over a memory file, and a memory file wins over a guess.

## Pointers

- Changing the ledger: read `memory/ledger-rounding.md`.
