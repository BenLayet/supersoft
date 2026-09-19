# Supersoft — instructions for Claude Code

Read `README.md` for the full picture. The essentials:

- Supersoft is a tool for specifying, prototyping and maintaining applications with the customer in the conversation. **It is built with the method it sells**: specification first, pure domain, mock adapters everywhere. Every cost it imposes on its users, its makers pay first.
- `docs/domain/` is the source of truth for business rules, tool-free. **A rule not written there does not exist.** The glossary (`docs/glossary.md`) maps every business term to its name in the code.
- **No tool names in `docs/domain/`** — no framework, no host, no database, no model, no product name. Supersoft is a tool for making software, so the temptation is constant. `Specification`, `prototype`, `demonstration` are business concepts of this product; named products are not. Tool names belong in `docs/decisions/` or `README.md`, nowhere else.
- `docs/domain/` describes the business only, never the tooling and never implementation status — no "already handled", "planned", "to be integrated". These documents change only when the business changes.
- Any new business rule: document it in `docs/domain/` first, add its glossary entry, then implement it in `packages/domain` with its tests (pure, no I/O), then integrate it in the app. A concept gets its glossary entry before it gets a name in the code.
- **Hexagonal**: the domain never imports a framework, an ORM or an SDK. The repository host, the code generator and any language model are **ports**, not dependencies. One external service = one port + one adapter.
- **Every port has a mock adapter**, so Supersoft runs end-to-end with no external service. Adding a port means adding its mock alongside.
- Structural decisions go in `docs/decisions/` as ADRs before they go in the code. The three that constrain everything: [0001](docs/decisions/0001-specification-lives-in-the-project-repository.md) specification lives in the project's repository; [0002](docs/decisions/0002-customer-edits-the-specification-never-the-code.md) the customer edits the specification, never the code; [0003](docs/decisions/0003-hexagonal-monorepo-pure-domain.md) hexagonal monorepo, pure domain.
- **No part of a project may depend on Supersoft continuing to exist.** Treat any proposal that breaks this as wrong by default and say so, whatever it buys.
- **Keep it short, and stay one step ahead of the prototype, never further.** A rule earns its place in `docs/domain/` when something runnable needs it. The first version of this repository specified a product nobody had seen; that is the mistake to avoid, and ADR [0004](docs/decisions/0004-the-prototype-is-a-web-application-held-in-memory.md) says why.
- Language: code, comments, tests and docs in English.
- This repository is public. The reference implementation and first customer project is a private repository and must never be named here — not in `docs/`, not in `README.md`, not in commit messages. Refer to it as "an existing project" when its existence is load-bearing for an argument. Local, uncommitted notes may name it.

## Status

pnpm monorepo, vitest for the domain:

- `packages/domain` (zero runtime dependencies) — `arrival` (who arrived, what was found, who may open or change it), `project` (participants: customer and maker; language and scope), `domain` (sources and questions on the informal side; subdomains, each owning its terms and rules, on the formal one), `feature` (stories gathered, state derived), `story` (priority, tracking, what comes next), `version` (gathering done stories, following a deployment), `prototype` (being tried, then validated), and two ports: `ports/project-store` (`ProjectStore`) and `ports/arrivals` (`Arrivals`).
- `apps/web` — the prototype: Next.js, React and Tailwind. Arriving at `/`, then a project at `/projects/<id>`, its menu following the steps a project grows by: 1 understand (scope, sources and questions, features), 2 describe, 3 prototype, 4 versions. Two fictional projects (`supersoft`, open to everyone; `medito`, not) plus one Supersoft cannot read, held in memory by `inMemoryProjectStore`; who is here lives in the visitor's own cookie through `cookieArrivals`. Server actions check the project recognises the person, then read it, apply a domain function and write it back. No outside service, nothing persisted. The interface speaks English or French (`src/i18n`, chosen in a cookie); both projects are written in French and never translated.

Not started: reading a specification from a project's own files, the generator, and the portal. The layout in `README.md` is the current state, not a target.

Imports inside a package are extensionless, resolved by vitest, Next and `tsc`.

`pnpm test` runs the domain; `pnpm dev` runs the prototype on port 3000.
