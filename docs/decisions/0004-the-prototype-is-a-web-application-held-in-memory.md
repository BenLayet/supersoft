# 0004 — Supersoft's own prototype is a web application, held in memory

**Status**: accepted; where the prototype lives superseded by [0006](0006-main-is-production-stories-and-prototypes-are-branches.md)

## Context

Supersoft sells specifying before building. Applied to itself, that turned into documents describing a product nobody had seen, and code serving a file format decided before any screen existed. The specification ran ahead of every use of it — which is the failure this product exists to prevent.

What was missing is the thing Supersoft asks its own users for: something runnable to have the conversation over.

## Decision

Supersoft has a prototype of its own, `apps/web`: Next.js, React and Tailwind — the same stack it will generate for its users — showing the activities of a project on one fictional project.

The prototype holds everything in memory. Two ports — `ProjectStore`, for the projects Supersoft opens, and `Arrivals`, for who is here and what they added — each with a mock adapter: fictional projects in memory, and one invented account remembered by the visitor's own browser. No database, no repository host, no outside service of any kind.

Every decision it takes comes from `packages/domain`, which stays pure and tested. The application shows and collects; it decides nothing.

## Consequences

**Easier.** The product can be looked at, clicked through and argued with. A missing rule shows up as a screen that cannot be drawn, which is a faster way to find it than reading a document.

**Easier.** A business rule has one obvious home: a pure function, with a test, under a document in `docs/domain/`. There is no second place for it to hide.

**Harder.** Nothing is persisted: restart the prototype and the fictional project comes back as it was. That is deliberate — persistence is a port waiting for the moment a real project needs it, and [0001](0001-specification-lives-in-the-project-repository.md) already says where it will lead.

**Harder.** Choosing the stack before the generator exists risks the prototype flattering a stack it has not yet had to produce. The mitigation is that this is the stack already used to build with this method, not a fresh bet.
