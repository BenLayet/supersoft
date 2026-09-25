# Supersoft

A support for the conversation between a maker and a customer about a web or mobile application: specifying it, planning it, and following it into real use.

The expensive failure in this work is not writing code. It is building the wrong thing, slowly, and finding out late. Supersoft answers that with one commitment:

> **The written business is the source of truth, it is in the customer's own words, and the application is a consequence of it.**

A project gets there step by step — scope, lexicon and rules, prototypes tried with the people who will use them, then versions connected to the real world — as [the domain documents](docs/domain/README.md#how-a-project-grows) describe and [the general presentation](docs/discovery/20260916%20general%20presentation/general%20presentation%20-%20key%20points.md) tells.

Its longer purpose is to lower the cost of good software for organisations that cannot afford it: charities, associations, and people meeting real needs with no budget.

## What it covers

A project has three parts, and [the domain documents](docs/domain/README.md) say what each one is:

| | |
| --- | --- |
| **[The project](docs/domain/project.md)** | who takes part, and how someone arrives at a project Supersoft did not create |
| **[The business](docs/domain/business.md)** | what the application serves — informal (what was said, recorded, filmed, asked) and formal (the lexicon and the description, the project's main source of truth) |
| **[The solution](docs/domain/solution.md)** | what the application does about it — features broken into stories, gathered into versions, followed into real use |

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
5. **[`main` is production; stories and prototypes are branches](docs/decisions/0006-main-is-production-stories-and-prototypes-are-branches.md)** — a prototype is built like the application, depends on nothing outside itself, and reaches `main` story by story.

**No part of a project may depend on Supersoft continuing to exist.** A project abandoned by its maker, and by Supersoft, must remain a working application another maker can pick up by reading its specification.

## Layout

```
supersoft/
├── apps/
│   └── web/            # @supersoft/web — the application
├── packages/
│   ├── domain/         # @supersoft/domain — pure TS, zero runtime dependencies
│   └── adapters/       # @supersoft/adapters — what the ports reach, starting with their mocks
└── docs/
    ├── domain/         # business rules & ubiquitous language (tool-free)
    ├── decisions/      # Architecture Decision Records
    ├── features/       # Supersoft's own features and stories
    └── glossary.md     # business terms ↔ names in the code
```

## Running it

```bash
pnpm install
pnpm test        # the domain and the adapters
pnpm --filter @supersoft/web dev                             # projects read from their repositories, local ones included
SUPERSOFT_ADAPTERS=mock pnpm --filter @supersoft/web dev     # no outside service at all
docker build -t supersoft . && docker run -p 3000:3000 supersoft   # as in production
```

## Status

Early, and deliberately small. `@supersoft/domain` holds arrivals, participants, workshops, domains, terms, rules, questions, features, stories and versions as pure functions. `main` is production: stories are built on `stories/…` branches, and prototypes live on `prototypes/…` branches, taken into `main` story by story once validated ([0006](docs/decisions/0006-main-is-production-stories-and-prototypes-are-branches.md)). The first prototype, `prototypes/001`, shows all of the domain on two fictional projects — Supersoft itself, a public project, and an association of meditators, a private one — with nothing stored anywhere.

The application, `apps/web`, opens a project at the address of its repository and shows that address; its next stories are in [`docs/features/`](docs/features/). The generator and the portal do not exist yet.

The method itself is not a guess: an existing application was built with it — specification as files, pure domain, a mock adapter for every port — before any of this tooling existed.
