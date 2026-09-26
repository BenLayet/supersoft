# Supersoft

Supersoft is an application where a customer and a maker co-create an application together, going step by step from a business need to fluid application that fits the need.

## The business

A project goes round the same cycle, once for every feature:

1. **Workshop** — the customer and the maker meet. What was said, shown or recorded is kept as it came.
2. **Domain** — the business is written from it: its terms, its rules, its open questions, in the customer's words.
3. **Prototype** — a prototype with mock-data is tested and refined with users.
4. **Stories** — the validated prototype is cut into stories, each with its business value and development effort.
5. **Roadmap** — the stories are prioritised and scheduled.
6. **Implementation** — each story is implemented and deployed in an integration environment.
7. **Version** — done stories are gathered, deployed to production.
8. **Feedback** — the users can give feedback, potentially generating new workshops.

The written business is the source of truth; the application is a consequence of it. [`docs/domain/`](docs/domain/README.md) says the rest.

## The solution

The aim of Supersoft is to support the cycle above, and to do it in a way that makes the business and the solution live together in one git repository. The customer and the maker can read and change that repository without Supersoft, and if Supersoft stops existing, the project goes on.

## The architecture

Supersoft is a layer over git. A project's code and its specification live together in the project's own repository — GitHub, GitLab or any other. Supersoft reads that repository, shows it to the customer, and writes changes back as commits and pull requests. Nothing is stored in Supersoft itself, and nothing is lost if Supersoft stops existing.

What Supersoft defines is a format: Markdown files, and where they go.

```bash
project/
├── README.md                   # the scope: what the application is for
└── docs/
    ├── workshops/
    │   └── <date> <title>/     # what a workshop left behind: notes, recordings, slides
    ├── domain/                 # one file per domain: terms, rules, questions
    ├── glossary.md             # each term ↔ its name in the code
    └── features/
        └── A-<feature>/
            ├── README.md
            └── A001-<story>.md # value, effort, state, what blocks it
```

`main` is production. Each story is built on a `stories/<story>` branch, each prototype lives on a `prototypes/<number>` branch, and a version is a git tag plus a file naming its stories.

Hence the one rule over all the others: **no part of a project may depend on Supersoft continuing to exist.** Without Supersoft, a project is still a repository any maker can read, change and take over.

The choices behind this are in [`docs/decisions/`](docs/decisions/README.md).

## This repository

Supersoft is built with its own method, so this repository follows the layout above. The code:

```bash
apps/web/            # the application
packages/domain/     # the business rules, pure TypeScript, no dependencies
packages/adapters/   # what the domain reaches outside itself, each with a mock
```

```bash
pnpm install
pnpm test                                                    # the domain and the adapters
pnpm --filter @supersoft/web dev                             # projects read from their repositories
SUPERSOFT_ADAPTERS=mock pnpm --filter @supersoft/web dev     # no outside service at all
docker build -t supersoft . && docker run -p 3000:3000 supersoft   # as in production
```

Early and deliberately small: the application opens a project at the address of its repository. What comes next is in [`docs/features/`](./docs/features/README.md).
