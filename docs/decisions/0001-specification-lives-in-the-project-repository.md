# 0001 — The specification lives in the project's own repository

**Status**: accepted (2026-07); where stories and versions are kept superseded by [0008](0008-the-business-is-in-files-the-solution-in-github-issues.md)

## Context

Supersoft's central claim is that the written [business](../domain/business.md) is the source of truth of a project, and that the customer can [take everything and leave at any moment](../domain/project.md). Where the specification physically lives decides whether that claim is real.

The forces at play:

- **The handover guarantee is load-bearing.** It is not a feature; it is the reason the charity-facing purpose is credible. A guarantee that depends on Supersoft's servers, company or continued goodwill is not a guarantee.
- **Specifications need review, history and attribution.** Who changed this rule, when, at whose request, and what did it say before — these are the questions a specification exists to answer, and they are exactly the questions version control already answers well.
- **The specification and the code must not drift.** They change together, are reviewed together, and one explains the other.
- **A prior project already works this way.** A real, non-trivial specification of a real organisation, maintained as files alongside the code. It is the only proven instance of the method, and it can be dogfooded on day one only if the format is files.
- **A hosted database would be easier for real-time collaboration**, comments and the no-code editor — the parts of the product that are not yet built.

## Decision

1. **A project's specification is a set of files in that project's own repository**, alongside its code: business documents in `docs/domain/`, the brand in a structured file, the stories in structured files.

2. **Prose is primary; structure is attached to it, not a replacement for it.** A domain document is a document a customer reads. Machine-readable structure (terms, states, identifiers on statements) rides along in front matter and sidecar files. Anything a generator or an editor needs that would damage readability lives in the sidecar, not in the prose.

3. **Version control is the history mechanism.** Revisions, authorship, dates and the record of what changed are git's, not a table of ours. Agreements, which are business events rather than edits, are recorded as files too, so that they travel with the project.

4. **The portal is a git client.** It reads the repository, renders the specification for a customer, collects remarks and agreements, and writes changes back as commits and pull requests. It holds no authoritative state of its own; anything it stores is a cache that can be rebuilt from the repository.

5. **A project remains fully usable with no portal at all** — read, edited and reviewed with an editor and git. This is the test the portal must never break.

## Consequences

Easier:

- Handover is trivial and needs no cooperation: the customer already has everything, in a standard format, in a repository they own.
- Review, history, attribution, branching and diffing come for free, and specification changes travel in the same pull request as the code that implements them.
- The first real project is available on day one, with no migration.
- Supersoft can fail as a business without any project it touched being harmed. This is a design goal, not a contingency.

Harder / accepted costs:

- **Real-time collaboration is not free.** Two people editing the same document at once is a merge, not a live cursor. Accepted: specifications move at the speed of conversation, not of typing.
- **The no-code editor is harder to build.** It must produce valid file changes rather than write rows, and must handle conflicts. This is the price of the guarantee.
- **Querying across projects is not free.** Anything cross-project (a library of patterns shared between projects, search) needs its own index, built by reading repositories.
- **The customer needs a repository.** For non-technical customers this must be invisible — provisioned and operated by the maker or the portal. If the customer is ever asked to understand git, the product has failed at its own job.
- **Structured data in files can go stale or invalid.** The format needs validation as a build step, in the same way tests are.

## Notes

The rejected alternative — specification in a Supersoft database, repositories as an export target — is easier for everything except the one thing that cannot be compromised. An export is not a guarantee: it is a promise to cooperate later, which is exactly what an organisation without leverage cannot rely on.

A read-only projection of specifications into a database, built by indexing repositories, is not excluded by this decision and will likely be needed for search and for the pattern library. What is excluded is that projection ever becoming the source of truth.
