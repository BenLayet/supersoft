# @supersoft/domain

The business rules of Supersoft as pure TypeScript: **zero runtime dependencies**, no framework, no I/O.

Every type and function here has an entry in the [glossary](../../docs/glossary.md) and a document behind it in [`docs/domain/`](../../docs/domain/README.md). Read those first; this package only says the same thing in a language a machine can check.

- `project.ts` — the project and its participants, and who settles what.
- `specification.ts` — questions, terms and rules; agreeing, and what rewriting undoes.
- `story.ts` — stories, their priority, their tracking, and what comes next.
- `version.ts` — gathering done stories, and following a deployment.
- `ports/project-store.ts` — where a project is kept. The only port so far.

```bash
pnpm --filter @supersoft/domain test
```
