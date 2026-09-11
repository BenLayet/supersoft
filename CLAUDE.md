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
- Language: code, comments, tests and docs in English.
- This repository is public. The reference implementation and first customer project is a private repository and must never be named here — not in `docs/`, not in `README.md`, not in commit messages. Refer to it as "an existing project" when its existence is load-bearing for an argument. Local, uncommitted notes may name it.

## Status

pnpm monorepo, vitest everywhere:

- `packages/domain` (zero runtime dependencies) — `project/participant`, `specification/statement`, `specification/specification` (Specification, Term), `specification/revision` (the normalisation of ADR 0006), `conversation/remark`, `conversation/agreement`, `conversation/open-point`, and `ports/project-files` (the only port so far).
- `packages/project-files` — adapters for that port: `inMemoryProjectFiles` (the mock every port owes) and `fileSystemProjectFiles`.
- `packages/specification-files` — reading a specification from files, the only code allowed to know the format: prose with identifiers, optional sidecars, agreements as files, revisions computed (ADRs 0004, 0006, 0007). Validated against a real hand-written specification.

Not started: writing back to a project's files (assigning an identifier, recording an agreement), the generator, the portal, and everything in brand, stories, prototype, customer-building, delivery and shared-patterns. The layout in `README.md` is the target, not the current state.

Imports inside a package are extensionless, resolved by vitest and `tsc`. Nothing runs under plain `node` yet; whatever needs to (a validation command, the portal) gets a build step of its own.
