# The Supersoft domain

This folder describes **what Supersoft does**, in the language of the people it serves, with no reference to technical tooling. It is the source of truth for the vocabulary and the business rules:

- it is the **common language** between makers, customers and contributors;
- every business term maps to its name in the code in the [glossary](../glossary.md);
- a business rule that is not written here does not exist.

## What Supersoft is

Supersoft is a **support for the conversation** between a maker and a customer about a web or mobile application. Its method is borrowed from domain-driven design: the business is described, in the customer's words, before it is built.

It covers seven activities, in no strict order:

1. **Discovery** — asking what the application is for, and writing down what nobody knows yet.
2. **Formalising the domain** — the concepts of the business, their names, and the rules that govern them.
3. **Defining the solution** — what the application does about that business.
4. **Breaking it into stories** — what one person wants to do with it, and why.
5. **Planning and tracking the stories** — what is next, what is being built, what is finished.
6. **Cutting a version** — gathering finished stories into something that can be delivered.
7. **Following the deployment** — knowing where a version is on its way to real people.

Everything it produces belongs to the customer and stays readable without it.

## Writing conventions

- No mention of a tool, a piece of software or a technique. Supersoft is a tool for making software, so the temptation is constant — resist it.
- **These documents change only when the business changes** — never when the tooling changes. Nothing here says what is "already built", "in progress" or "planned".
- Keep it short. A rule nobody can find is a rule nobody follows.

## Language

Unlike a customer project, whose domain documents are written in the language of its own domain experts, Supersoft's are written in English: its domain experts are its makers.

## The documents

- [Project and participants](project.md) — what a project is and who takes part.
- [Specification](specification.md) — discovery, the domain, the solution.
- [Stories](stories.md) — breaking the work down, planning it, tracking it.
- [Versions and deployment](release.md) — delivering, and knowing where it is.

When a new concept appears: define it here first, then add it to the [glossary](../glossary.md) **before** giving it a name anywhere else.
