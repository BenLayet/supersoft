# 0006 — `main` is production; stories and prototypes are branches

**Status**: accepted (2026-09)

## Context

[0004](0004-the-prototype-is-a-web-application-held-in-memory.md) put Supersoft's prototype in the repository, as `apps/web`, next to the domain it applies. It did its job: the product could be clicked through and argued with, and the rules it needed were written first.

It also left `main` holding two things that do not age the same way. A prototype is tried, changed and thrown away; the application real people use is kept. With both on `main`, nothing says which code is the application and which is a sketch of it, and the first real story ("open a project at its address") has nowhere clean to start.

[0005](0005-git-holds-the-specification-the-host-holds-the-conversation.md) already says work in progress is a branch, never a row. The same holds for Supersoft's own work.

## Decision

1. **`main` is production.** It holds the specification (`docs/`), the domain (`packages/domain`), and the application real people use, once there is one. Nothing on `main` is a prototype.

2. **Every story is built on its own branch, `stories/<story>`**, named after its file: `stories/A001-open-a-project-at-its-address`. It reaches `main` when the story is done.

3. **Every prototype lives on its own branch, `prototypes/<number>`**, numbered in the order they are made: `prototypes/001` is the prototype `apps/web` was. A prototype branch is never merged as a whole. Once validated, what it shows reaches `main` story by story: each story's branch takes from the prototype the screens that story needs, with the domain rules they apply already on `main`.

4. **A prototype depends on nothing outside itself, and is built like the application.** It has the same architecture as production: every port it uses has a mock adapter, and every piece of data it shows is invented. It runs from a fresh clone of its branch, with one command and no account anywhere.

5. **A rule found while trying a prototype is written on `main` first**, on its own branch, like any change to the specification. The prototype then takes it by merging `main`.

## Consequences

**Easier.** What is on `main` is what real people use, and nothing else. A prototype can be as rough as it needs to be without anyone mistaking it for the application.

**Easier.** Because a prototype is built like the application, taking it into `main` means taking its screens and replacing its mock adapters, not rewriting it.

**Easier.** Branches travel with the repository. A prototype is kept, and can be tried again, by anyone who clones it, whether or not Supersoft still exists.

**Easier.** A prototype branch can be deployed on its own whenever it changes, for instance by an action on the repository host putting it online where the customer can try it. That deployment is a convenience: because a prototype depends on nothing outside itself, losing it loses nothing but a link.

**Harder.** A rule found in a prototype takes two steps instead of one: written on `main`, then merged into the prototype. That is the cost of `main` staying the only source of truth.

**Harder.** Git cannot merge part of a branch. A story takes files from the prototype (`git checkout prototypes/001 -- <files>`), and nothing tracks which of them have already been taken; the stories that were done say it.

**Harder.** A prototype needs a server, like the application. One that runs only in the browser could be published as static pages, but its screens would have to be restructured before reaching `main`.

**Harder.** The first merge of `main` into `prototypes/001` deletes `apps/web`, because `main` no longer has it. That merge must restore it. It happens once.

## Notes

The branch prefixes are plural, `stories/` and `prototypes/`, so that no branch can ever be named `story` or `prototype` alone and block them.
