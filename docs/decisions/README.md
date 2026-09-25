# Architecture Decision Records

Records of the structural technical decisions behind Supersoft: what was decided, in which context, and what it costs. One file per decision, numbered in order (`0001-…`, `0002-…`), never deleted — a reversed decision gets a new ADR that supersedes the old one.

Unlike [`docs/domain/`](../domain/README.md) (business rules, tool-free), ADRs are about the software and its tooling. Every tool name in this repository belongs here or in the README, and nowhere else.

Format: **Status** (proposed / accepted / superseded by NNNN), **Context** (the forces at play), **Decision** (what we chose), **Consequences** (what becomes easier, what becomes harder).

## Index

- [0001 — The specification lives in the project's own repository](0001-specification-lives-in-the-project-repository.md)
- [0002 — The customer's editing surface is the specification, never the code](0002-customer-edits-the-specification-never-the-code.md)
- [0003 — Hexagonal monorepo with a pure TypeScript domain](0003-hexagonal-monorepo-pure-domain.md)
- [0004 — Supersoft's own prototype is a web application, held in memory](0004-the-prototype-is-a-web-application-held-in-memory.md)
- [0005 — Git holds the specification; the repository host holds the conversation](0005-git-holds-the-specification-the-host-holds-the-conversation.md)
- [0006 — `main` is production; stories and prototypes are branches](0006-main-is-production-stories-and-prototypes-are-branches.md)
