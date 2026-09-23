# @supersoft/web

Supersoft's own prototype: arriving at a project, then its overview (the scope, and who takes part)
and its three parts — the business (workshops by date, domains with their lexicon, rules and questions),
the features (stories and prototypes), and the versions.

Two projects are on offer. **Supersoft** is a public project: it can be read without signing in,
and it is Supersoft described in its own terms. **Medito** is an invented association of meditators
publishing recorded practices and gathering for events, a private project read only by the people
it recognises.

Supersoft speaks French or English — the visitor's choice, else their browser's — through two
dictionaries in `src/i18n`. The projects themselves are written in French, say so, and are never
translated: a French story reads "En tant que…" whichever language Supersoft is speaking.

It runs with **no outside service**: the projects are held in memory by `inMemoryProjectStore`, and
who is here, and which projects they added, are remembered by the visitor's own browser through
`cookieArrivals` — the mock adapters
of the two ports. Signing in invents one account. Every decision it takes comes from
[`@supersoft/domain`](../../packages/domain/README.md); this app only shows and collects, and the
rule that changing anything means being recognised is enforced in the actions, not in the buttons.

```bash
pnpm dev        # http://localhost:3000
```

Changes survive while the server runs and disappear when it restarts. That is the point: a prototype
is disposable, and nothing true lives only here.
