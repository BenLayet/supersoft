# @supersoft/domain

The business rules of Supersoft as pure TypeScript: **zero runtime dependencies**, no framework, no I/O.

Every type and function here has an entry in the [glossary](../../docs/glossary.md) and a document behind it in [`docs/domain/`](../../docs/domain/README.md). Read those first; this package only says the same thing in a language a machine can check.

- `arrival.ts` — who arrived, what Supersoft found for them, and who may open or change it.
- `project.ts` — the project and its participants, and who settles what.
- `domain.ts` — sources and questions on the informal side; the lexicon and the description on the formal one, with agreeing and what rewriting undoes.
- `feature.ts` — the stories a feature gathers, and the state derived from them.
- `story.ts` — stories, their priority, their tracking, and what comes next.
- `version.ts` — gathering done stories, and following a deployment.
- `ports/project-store.ts` — where the projects are. Supersoft opens them; it never creates them.
- `ports/arrivals.ts` — who is here, and where they left off.

```bash
pnpm --filter @supersoft/domain test
```
