# @supersoft/web

Supersoft's own prototype: the three parts of a project — the project, the domain (informal and
formal) and the solution (features and versions) — on one fictional project, an association of
meditators publishing recorded practices and gathering for events.

It runs with **no outside service**: the project is held in memory by `inMemoryProjectStore`, the
mock adapter of the `ProjectStore` port, seeded with fictional data. Every decision it takes comes
from [`@supersoft/domain`](../../packages/domain/README.md); this app only shows and collects.

```bash
pnpm dev        # http://localhost:3000
```

Changes survive while the server runs and disappear when it restarts. That is the point: a prototype
is disposable, and nothing true lives only here.
