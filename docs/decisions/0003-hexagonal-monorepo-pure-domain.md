# 0003 — Hexagonal monorepo with a pure TypeScript domain

**Status**: accepted (2026-07)

## Context

Supersoft is itself an application, and it is the tool that will produce other applications. Two consequences follow:

- **It must be built the way it recommends building.** A tool that generates a hexagonal, mock-first, specification-first project while being none of those things is not credible, and its authors will not feel the costs they are imposing on their users.
- **Its own architecture is the reference implementation** of what it generates. Decisions made here become the shape of every generated project, so they are worth making once, deliberately.

The method is not invented here. It is the architecture of an existing project, which is the only proven instance of the whole approach and the first project Supersoft will serve.

The forces at play:

- **The domain here is unusually durable.** What a specification, a remark, an agreement or a proposal *is* changes slowly. Repository hosts, editors, generation techniques and interface frameworks change fast.
- **Generation is a pure function of the specification**, and must be testable as one — without a repository, a network, or a model.
- **Supersoft must be abandonable**, by [ADR 0001](0001-specification-lives-in-the-project-repository.md). It cannot grow a hard dependency on any hosted service.
- **The generator will be rewritten.** The technique for turning a specification into code is the least settled part of the product and the most likely to change several times. It must be replaceable without touching what a specification means.

## Decision

1. **pnpm monorepo, TypeScript everywhere**, mirroring the shape of that project:
   - `packages/domain` (`@supersoft/domain`) — the business rules of Supersoft: **zero runtime dependencies**;
   - further packages as the product needs them, each obeying the same rule about its own boundary.

2. **Hexagonal architecture (ports and adapters).** The domain never imports a framework, an ORM or an SDK. One external service = one port in the domain + one adapter outside it. In particular the **repository host**, the **generator** and any **language model** are ports — none of them is a dependency of the domain.

3. **Business decisions are pure functions**, tested without I/O: whether a statement is agreed in the version it now has, what a project's open points are, whether a proposal touches a reserved decision, what a specification change implies.

4. **Every port has a mock adapter**, so Supersoft runs end-to-end with no external service — for demonstrations, prototyping and CI. Adding a port means adding its mock alongside. This is not a testing convenience; it is the same guarantee Supersoft makes to its users about their prototypes, applied to itself.

5. **`docs/domain/` is the source of truth for business rules**, tool-free, with the [glossary](../glossary.md) mapping every term to its name in the code. Every new rule is documented there first, then implemented in the domain with its tests, then integrated in the application.

6. **Container-based deployment as the exit guarantee**, so no hosting platform is load-bearing.

## Consequences

Easier:

- The rules of the product are testable in milliseconds, and the domain test suite is the executable form of `docs/domain/`.
- The generator can be replaced — including a complete change of technique — without touching what a specification means.
- Supersoft dogfoods its own method, so every cost it imposes is a cost its makers pay first.
- Its own repository is a worked example a maker can read to understand what a generated project looks like.

Harder / accepted costs:

- Every external interaction needs a port designed first. Deliberate friction, and heavier here than in that project because a tool that reads repositories and generates code touches the outside world constantly.
- Two places to keep honest — `docs/domain/` and the code. The rule "document first, implement second" exists to prevent drift, and Supersoft has no excuse for drifting, since preventing it is what it sells.
- Mock adapters for a repository host and a code generator are substantial work in themselves.

## Notes

Some structural choices are deliberately left open and will each get their own ADR when decided: the repository host integration, the generation technique, and how generated and hand-written code coexist ([ADR 0002](0002-customer-edits-the-specification-never-the-code.md) point 5).

They are not part of this decision. The architecture above is what makes each of them reversible.
