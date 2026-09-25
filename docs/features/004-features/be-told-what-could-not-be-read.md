# Be told what could not be read

**As a** maker, **I want** to be told which file Supersoft could not read, and why, **so that** I correct the file instead of wondering why a story is missing.

- Business Value: M
- Effort: S
- State: to do

## Path

When a story has no reason, no business value, no effort, or a size Supersoft does not know, the project still opens. The story is listed with what is missing and its file.

## Tests

- A story without "so that" is shown as unreadable, with its file.
- A business value or an effort that is not XXS, XS, S, M, L or XL is shown as unreadable.
- No story is ever left out silently: every file in a feature's folder is either a story or shown as unreadable.
