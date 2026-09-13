# Supersoft

A support for the conversation between a maker and a customer about a web or mobile application: specifying it, planning it, and following it into real use.

The expensive failure in this work is not writing code. It is building the wrong thing, slowly, and finding out late. Supersoft answers that with one commitment:

> **The specification is the source of truth, it is written in the customer's own words, and the application is a consequence of it.**

Its longer purpose is to lower the cost of good software for organisations that cannot afford it: charities, associations, and people meeting real needs with no budget.

## What it covers

Seven activities, in no strict order — [the domain documents](docs/domain/README.md) say what each one is:

| | |
| --- | --- |
| **Discovery** | writing down what nobody knows yet |
| **The domain** | the concepts of the business, their names, the rules that govern them |
| **The solution** | what the application does about that business |
| **Stories** | what one person wants to do with it, and why |
| **Planning** | what is next, what is being built, what is finished |
| **Versions** | gathering done stories into something deliverable |
| **Deployment** | knowing where a version is on its way to real people |

## Method: describe the business, then build it

Everything lives under `docs/`, and the order never changes: the business document, the glossary, the pure domain with its tests, then the application.

- **[`docs/domain/`](docs/domain/README.md)** — the business rules and the ubiquitous language, tool-free. A rule not written there does not exist.
- **[`docs/glossary.md`](docs/glossary.md)** — every business term mapped to its name in the code. A concept gets its entry before it gets a name.
- **[`docs/decisions/`](docs/decisions/README.md)** — the structural technical choices, their context and their costs. Every tool name in this repository lives there or in this file.

This is the method Supersoft applies to its users' projects, applied to Supersoft itself: every cost it imposes, its makers pay first.

## The decisions that shape everything

1. **[A project's specification lives in the project's own repository](docs/decisions/0001-specification-lives-in-the-project-repository.md)** — as files, next to the code. This is what makes handover a guarantee rather than a promise to cooperate later.
2. **[The customer's editing surface is the specification, never the code](docs/decisions/0002-customer-edits-the-specification-never-the-code.md)**.
3. **[Hexagonal monorepo with a pure TypeScript domain](docs/decisions/0003-hexagonal-monorepo-pure-domain.md)** — the domain imports nothing external; everything outside is a port with a mock adapter.
4. **[Supersoft's own prototype is a web application, held in memory](docs/decisions/0004-the-prototype-is-a-web-application-held-in-memory.md)** — runnable before it is finished, with no outside service.

**No part of a project may depend on Supersoft continuing to exist.** A project abandoned by its maker, and by Supersoft, must remain a working application another developer can pick up by reading its specification.

## Layout

```
supersoft/
├── apps/
│   └── web/            # @supersoft/web — the prototype: Next.js, one fictional project in memory
├── packages/
│   └── domain/         # @supersoft/domain — pure TS, zero runtime dependencies
└── docs/
    ├── domain/         # business rules & ubiquitous language (tool-free)
    ├── decisions/      # Architecture Decision Records
    └── glossary.md     # business terms ↔ names in the code
```

## Running it

```bash
pnpm install
pnpm test        # the domain, in a few milliseconds
pnpm dev         # the prototype, on http://localhost:3000
```

## Status

Early, and deliberately small. The domain holds participants, questions, terms, rules, stories and versions as pure functions. The prototype shows all of it on one fictional project, with nothing stored anywhere.

The generator, the portal, and reading a specification from a project's own files do not exist yet. The first of those to be built will be the one the prototype makes impossible to avoid.

The method itself is not a guess: an existing application was built with it — specification as files, pure domain, a mock adapter for every port — before any of this tooling existed.
