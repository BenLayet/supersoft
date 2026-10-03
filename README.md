# Clarée

Clarée is an application where a domain expert and a maker co-create an application together, going step by step from a business need to fluid application that fits the need.

## The business

A project goes round the same cycle, once for every feature:

1. **Workshop** — the domain expert and the maker meet. What was said, shown or recorded is kept as it came.
2. **Domain** — the business is written from it: its terms, its rules, its open questions, in the domain expert's words.
3. **Prototype** — a prototype with mock-data is tested and refined with users.
4. **Stories** — the validated prototype is cut into stories, each with its business value and development effort.
5. **Roadmap** — the stories are prioritised and scheduled.
6. **Implementation** — each story is implemented and deployed in an integration environment.
7. **Version** — done stories are gathered, deployed to production.
8. **Feedback** — the users can give feedback, potentially generating new workshops.

The written business is the source of truth; the application is a consequence of it. [`docs/domain/`](docs/domain/README.md) says the rest.

## The solution

The aim of Clarée is to support the cycle above, and to do it in a way that keeps the whole project in one GitHub repository: the business in its files, the solution in its issues. The domain expert and the maker can read and change that repository without Clarée, and if Clarée stops existing, the project goes on GitHub.
 The domain experts own a GitHub organisation, where their projects live and the maker is a member. Clarée reads a project's repository, shows it to the domain expert, and writes changes back as commits, pull requests and issues. Nothing is stored in Clarée itself, and nothing is lost if Clarée stops existing.

The business is in files, and changes with the code that applies it:

```bash
project/
├── README.md                   # the scope: what the application is for
├── CHANGELOG.md                # each version and the stories it carried
└── docs/
    ├── workshops/
    │   └── <date> <title>/     # what a workshop left behind: notes, recordings, slides
    ├── domain/                 # one file per domain: terms, rules, questions
    └── glossary.md             # each term ↔ its name in the code
```

The solution is in the repository's issues:

- a **feature** is an issue labelled `feature`, and its **stories** are its sub-issues;
- **business value** and **effort** are labels, `value: M` and `effort: S`, and what blocks a story is GitHub's "blocked by";
- a story is **in progress** while an open pull request closes it, and **done** once closed;
- a **version** is gathered in a milestone, then cut as a git tag and a section of `CHANGELOG.md`.

`main` is production. Each story is built on a `stories/<number>-<title>` branch, and each prototype lives on a `prototypes/<number>` branch.

Hence the one rule over all the others: **no part of a project may depend on Clarée continuing to exist.** Without Clarée, a project is still a repository any maker can read, change and take over.

The choices behind this are in [`docs/decisions/`](docs/decisions/README.md).

## This repository

Clarée is built with its own method, so this repository follows the layout above, and its features and stories are its [issues](https://github.com/softersoftware/claree/issues). The code:

```bash
apps/web/            # the application
packages/domain/     # the business rules, pure TypeScript, no dependencies
packages/adapters/   # what the domain reaches outside itself, each with a mock
```

```bash
pnpm install
pnpm test                                                    # the domain and the adapters
pnpm --filter @claree/web dev                                # projects read from their repositories
CLAREE_ADAPTERS=mock pnpm --filter @claree/web dev           # no outside service at all
docker build -t claree . && docker run -p 3000:3000 claree   # as in production
```

Early and deliberately small: the application opens a project at the address of its repository. What comes next is in its [issues](https://github.com/softersoftware/claree/issues).
