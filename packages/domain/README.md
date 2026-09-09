# @supersoft/domain

Supersoft's business rules, as pure functions: what a specification, a
statement, an agreement, a remark and a proposal are, and what follows from
them.

## The rule that matters

**This package imports nothing external.** No framework, no ORM, no SDK, no
HTTP client, no model. Its `dependencies` are empty and are meant to stay
empty; `devDependencies` hold the type checker and the test runner, nothing
else. Everything from the outside world — the current date included — arrives
as an argument or through a port in `src/ports`.

This is [ADR 0003](../../docs/decisions/0003-hexagonal-monorepo-pure-domain.md).
It is what makes the rules of the product testable in milliseconds, and what
lets the generator be replaced without touching what a specification means.

## Where the rules come from

[`docs/domain/`](../../docs/domain/README.md) is the source of truth, in
business language and free of any tool name.
[`docs/glossary.md`](../../docs/glossary.md) fixes the name each concept
carries here. The order is always the same: the business document, then the
glossary entry, then the code and its tests.

The test suite is the executable form of `docs/domain/`. A test that has no
corresponding sentence in those documents is describing a rule that does not
exist yet — write the sentence first.

## Layout

    src/
      project/        projects, participants, levels
      specification/  statements, states, terms, revisions
      conversation/   remarks, questions, agreements, open points
      prototype/      prototypes, fictional data, scenarios
      pattern/        shared patterns: adoption, contribution
      ports/          interfaces expected from the outside world

Each folder holds its rules next to their tests (`*.test.ts`).
