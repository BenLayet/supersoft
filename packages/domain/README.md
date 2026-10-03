# @claree/domain

The business rules of Clarée as pure TypeScript: **zero runtime dependencies**, no framework, no I/O.

Every type and function here has an entry in the [glossary](../../docs/glossary.md) and a document behind it in [`docs/domain/`](../../docs/domain/README.md). Read those first; this package only says the same thing in a language a machine can check.

- `arrival.ts` — who arrived, what Clarée found for them, and who may open or change it.
- `project.ts` — the project, its language and scope, its participants, and who settles what.
- `business.ts` — the workshops on the informal side; the domains, each owning its lexicon, its description and its open questions, on the formal one, with agreeing and what rewriting undoes.
- `feature.ts` — the stories a feature gathers, and the state derived from them.
- `story.ts` — stories, their value and effort, their tracking, and what comes next.
- `version.ts` — gathering done stories, and following a deployment.
- `prototype.ts` — the prototypes of a feature, each being tried until a domain expert validates it.
- `ports/project-store.ts` — where the projects are. Clarée opens them; it never creates them.
- `ports/arrivals.ts` — who is here, and where they left off.
- `ports/project-files.ts` — what is kept at a project's address, read and never written.

```bash
pnpm --filter @claree/domain test
```
