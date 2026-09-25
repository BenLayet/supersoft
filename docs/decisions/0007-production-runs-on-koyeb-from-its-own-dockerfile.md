# 0007 — Supersoft's production runs on Koyeb, from its own Dockerfile

**Status**: accepted (2026-09)

## Context

[0006](0006-main-is-production-stories-and-prototypes-are-branches.md) makes `main` production. The first story, A001, will put an application on it, and that application needs somewhere to run before it is written, so that "done" means the customer could see it working.

The forces at play:

- **It is one application**, a server, with no database of its own: [0005](0005-git-holds-the-specification-the-host-holds-the-conversation.md) says Supersoft holds only what can be emptied without any project losing anything.
- **Reading a project needs a disk and git**, to clone its repository. Only as a cache, lost without harm on every restart.
- **Administering a server is a cost its makers would rather not pay** while nothing depends on the application yet. Hosting in France is welcome, not required.
- **Nothing decided now may close a road later.** In particular, how prototypes are shared with the people who try them is not settled.

## Decision

1. **Supersoft's production runs on Koyeb**, as one service following `main`, built from the Dockerfile at the root of the repository. It is redeployed whenever `main` changes.

2. **The Dockerfile is the contract.** Nothing in the application is written for Koyeb, and none of its own services (databases, storage) are used. Moving to any other container host means running the same image there.

3. **The disk is temporary.** Whatever Supersoft writes to it (a clone, a cache) can be lost at any restart, as 0005 already requires.

4. **One instance, in Frankfurt**, the region on offer, until real use asks for more.

5. **Prototypes are not hosted for now.** Their makers try them locally. How a prototype is put in front of the people who try it is decided later, in its own ADR.

## Consequences

**Easier.** Nothing to administer: Koyeb builds, deploys, keeps the service running and gives it a certificate.

**Easier.** Leaving costs one image moved elsewhere, because the application never learns where it runs.

**Harder.** Supersoft depends on a small company's offer and prices. The Dockerfile keeps that dependency shallow.

**Harder.** A customer cannot try a prototype without a maker showing it. Accepted while the only prototypes are Supersoft's own.

## Open question

A prototype exists to validate what people see and do, and it must stay quick to change and quick to put online. That points towards prototypes published as static pages, which the repository host can serve from a branch, built whenever a prototype changes. It would revise the part of 0006 that says a prototype is built like the application and needs a server. It is left for the ADR that decides how prototypes are hosted.

## Notes

Weighed and set aside for production, for now:

- **A virtual private server run with Coolify**: one fixed price for production and any number of prototypes, but a server to keep up to date. It may come back if prototypes of many projects need a server of their own.
- **Running the prototypes inside production's own container**, with Docker in Docker: most platforms refuse it, it rebuilds a hosting platform by hand, and it would run code from customer repositories next to the access tokens production holds for them. Production and prototypes never share a machine.
- **Serverless hosting built for the framework** (Vercel): no disk to clone a repository into, and applications shaped for that host.
- **A large cloud** (AWS): able to do all of it, at a complexity and with a bill that nothing here needs.
