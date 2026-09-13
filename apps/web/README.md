# @supersoft/web

Supersoft's own prototype: the seven activities of a project — discovery, the domain, the solution,
stories, planning, versions, deployment — on one fictional project.

It runs with **no outside service**: the project is held in memory by `inMemoryProjectStore`, the
mock adapter of the `ProjectStore` port, seeded with fictional data. Every decision it takes comes
from [`@supersoft/domain`](../../packages/domain/README.md); this app only shows and collects.

```bash
pnpm dev        # http://localhost:3000
```

Changes survive while the server runs and disappear when it restarts. That is the point: a prototype
is disposable, and nothing true lives only here.
