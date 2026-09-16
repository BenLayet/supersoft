# @supersoft/web

Supersoft's own prototype: arriving at a project, then its three parts — the project, the domain
(informal and formal) and the solution (features and versions).

Two projects are on offer. **Supersoft** is open to everyone: it can be read without signing in,
and it is Supersoft described in its own terms. **Medito** is an invented association of meditators
publishing recorded practices and gathering for events, open only to the people it recognises. A
third, `bakery-site`, is there to be refused: it is not written in the form Supersoft reads, and it
says so instead of hiding.

Supersoft speaks French or English — the visitor's choice, else their browser's — through two
dictionaries in `src/i18n`. The projects themselves are written in French, say so, and are never
translated: a French story reads "En tant que…" whichever language Supersoft is speaking.

It runs with **no outside service**: the projects are held in memory by `inMemoryProjectStore`, and
who is here is remembered by the visitor's own browser through `cookieArrivals` — the mock adapters
of the two ports. Signing in invents one account. Every decision it takes comes from
[`@supersoft/domain`](../../packages/domain/README.md); this app only shows and collects, and the
rule that changing anything means being recognised is enforced in the actions, not in the buttons.

```bash
pnpm dev        # http://localhost:3000
```

Changes survive while the server runs and disappear when it restarts. That is the point: a prototype
is disposable, and nothing true lives only here.
