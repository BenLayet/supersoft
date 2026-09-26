# 0008 — Stories still to do go straight to `main`

**Status**: proposed (2026-09)

## Context

[0006](0006-main-is-production-stories-and-prototypes-are-branches.md) makes `main` production and puts every change to the specification on its own branch. Writing the first stories under it showed a cost it did not weigh: a story found while building another one has nowhere to go. Committed on the branch being built, it waits for that story to be done before anyone sees it. Put on a branch of its own, it takes a pull request to add a file that changes nothing.

The forces at play:

- **What `main` says must be true of production.** A rule on `main` that the application does not apply is a lie about it. That is why a rule, and the state of a story, change with the code that makes them true, in the same pull request ([0001](0001-specification-lives-in-the-project-repository.md)).
- **A story still to do promises nothing.** It says what is wanted next, not what the application does. Adding, rewording or reordering one leaves everything on `main` true.
- **Customers will write stories.** Asking them for a branch and a pull request for each one is ceremony that protects nothing, and [0001](0001-specification-lives-in-the-project-repository.md) says that if a customer is ever asked to understand git, the product has failed. Supersoft should take the short road on itself first.
- **A separate repository for the documentation is not an option.** It would break [0001](0001-specification-lives-in-the-project-repository.md): the specification and the code would no longer change together, and a project would no longer be at one address.

## Decision

1. **A story whose state is "to do" is written, changed or removed directly on `main`**, in a commit of its own, without a branch.

2. **Everything else still goes through a branch**, as [0006](0006-main-is-production-stories-and-prototypes-are-branches.md) says:
   - a story's state, from "in progress" on, changes on its `stories/<story>` branch, with the code that makes it true;
   - a business rule (`docs/domain/`) and its glossary entry are written on the branch of the story that needs them;
   - a decision is written on its `decisions/<decision>` branch.

3. **A story found while building another is not committed on that story's branch.** It goes to `main` on its own.

## Consequences

**Easier.** A story reaches `main` as soon as it is written. Once Supersoft reads its own stories, it shows them straight away.

**Easier.** The branch of a story holds that story, and nothing else.

**Harder.** A story written straight to `main` is read by nobody before it lands. Accepted: it commits no one to anything, and it can be changed as easily as it was added.

**Harder.** The line is drawn by a story's state, which is written by hand. A story marked "to do" that is already being built must move to "in progress" on its branch first; changing it on `main` from then on is a mistake.
