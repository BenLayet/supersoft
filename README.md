# Supersoft

A tool for specifying, prototyping and maintaining web and mobile applications **in close conversation with the people who commissioned them**.

The expensive failure in this work is not writing code. It is building the wrong thing, slowly, and finding out late. Supersoft answers that with one commitment:

> **The specification is the source of truth, it is written in the customer's own words, and everything else — the prototype, the application, the demonstration — is a consequence of it.**

Its longer purpose is to lower the cost of good software for organisations that cannot afford it: charities, associations, and people meeting real needs with no budget. Their needs repeat — members, events, donations, volunteers, people to follow up on — and every need described once and [held in common](docs/domain/shared-patterns.md) is a need the next organisation does not pay to describe again.

## Methodology: Domain Driven Design (DDD)

The business is described before it is coded, and the description is the source of truth. Everything lives under `docs/`:

- **[`docs/domain/`](docs/domain/README.md)** — the business rules and ubiquitous language, tool-free: what Supersoft does, readable by someone who will never see the code. A rule not written there does not exist. Start with [supersoft.md](docs/domain/supersoft.md), which presents the product and links to each subdomain.
- **[`docs/glossary.md`](docs/glossary.md)** — every business term mapped to its name in the code, grouped by subdomain. A concept gets its glossary entry before it gets a name in the code.
- **[`docs/decisions/`](docs/decisions/README.md)** — Architecture Decision Records: the structural technical choices, their context and their costs. Every tool name in this repository lives here or in this README, and nowhere else.

Any change follows that order: the business doc, the glossary (naming), the domain (pure functions + tests), then the application. The business docs evolve only when the business evolves — never when the tooling does.

This is the method Supersoft applies to its users' projects, applied to Supersoft itself. That is deliberate: every cost it imposes, its makers pay first.

## What it covers

| Subdomain | What it is |
| --- | --- |
| [Projects and participants](docs/domain/projects.md) | What a project is, who takes part, who may do what |
| [Specification](docs/domain/specification.md) | What must be built, in the customer's words — the source of truth |
| [Brand and style](docs/domain/brand.md) | Identity, tone, visual rules, accessibility commitments |
| [Stories and journeys](docs/domain/stories.md) | What people do with the application, and how we know it works |
| [Conversation and agreement](docs/domain/conversation.md) | Remarks, questions, change requests, agreement — nothing agreed by silence |
| [Prototype and demonstration](docs/domain/prototype.md) | A runnable application on fictional data, before anything real exists |
| [Building by the customer](docs/domain/customer-building.md) | Customers changing their own application — by changing the specification |
| [Real use and handover](docs/domain/delivery.md) | Going live, keeping the specification true, and leaving freely |
| [Shared patterns](docs/domain/shared-patterns.md) | Business descriptions that recur across projects, held in common |

## The three decisions that shape everything

1. **[A project's specification lives in the project's own repository](docs/decisions/0001-specification-lives-in-the-project-repository.md)** — as files, next to the code. Version control provides history, review and attribution. The portal is a git client with no authoritative state of its own. This is what makes handover a *guarantee* rather than a promise to cooperate later.

2. **[The customer's editing surface is the specification, never the code](docs/decisions/0002-customer-edits-the-specification-never-the-code.md)** — the low-code answer. A customer edit regenerates their prototype immediately and reaches real use only after review. This is the refusal that keeps the project from splitting into an application nobody can hand over and a specification nobody trusts.

3. **[Hexagonal monorepo with a pure TypeScript domain](docs/decisions/0003-hexagonal-monorepo-pure-domain.md)** — the domain imports nothing external; the repository host, the generator and any language model are ports. Every port has a mock adapter, so Supersoft itself runs end-to-end with no external service.

**No part of a project may depend on Supersoft continuing to exist.** A project abandoned by its maker, and by Supersoft, must remain a working application another developer can pick up by reading its specification.

## Architecture

pnpm monorepo, TypeScript everywhere, hexagonal architecture: business logic in a pure package, frameworks kept at arm's length.

```
supersoft/
├── packages/
│   └── domain/          # @supersoft/domain — pure TS, ZERO runtime dependencies
│       └── src/
│           ├── project/       # projects, participants, levels
│           ├── specification/ # statements, states, terms, revisions
│           ├── conversation/  # remarks, questions, agreements, open points
│           ├── prototype/     # prototypes, fictional data, scenarios
│           ├── pattern/       # shared patterns: adoption, contribution
│           └── ports/         # interfaces expected from the outside world
├── docs/
│   ├── domain/          # business rules & ubiquitous language (tool-free)
│   ├── decisions/       # Architecture Decision Records
│   └── glossary.md      # business terms ↔ names in the code
```

**The rule that matters**: `packages/domain` imports nothing external. Decisions — "is this version of the statement agreed?", "does this proposal touch a reserved decision?", "what are this project's open points?" — are pure functions, tested without a database, a network or a model.

## Status

Founding documents, plus the first slice of the domain: participants and their roles, statements and their states, remarks and questions, agreement on a version, and a project's open points — pure functions with zero runtime dependencies. The ports, the adapters, the generator and the portal do not exist yet; the layout above is the target, not the current state.

**First project**: an existing application, already built with this method — specification as files, pure domain, a mock adapter for every port. It is the proof the method works, and the first specification the tooling must be able to read.
