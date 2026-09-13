# The Supersoft domain

This folder describes **what Supersoft does**, in the language of the people it serves, with no reference to technical tooling. It is the source of truth for the vocabulary and the business rules:

- it is the **common language** between makers, customers and contributors;
- every business term maps to its name in the code in the [glossary](../glossary.md);
- a business rule that is not written here does not exist.

## What Supersoft is

Supersoft is a **support for the conversation** between a maker and a customer about a web or mobile application. Its method is borrowed from domain-driven design: the business is described, in the customer's words, before it is built.

A project has three parts, and they grow together rather than in sequence:

- **The project** — who is taking part.
- **The domain** — the business itself. Informal on one side: what was said, recorded and asked, kept as it came. Formal on the other: the lexicon and the official description of the business, which is the project's main source of truth.
- **The solution** — what the application does about that business: features, broken into stories, gathered into versions and followed into real use.

Everything it produces belongs to the customer and stays readable without it.

## Writing conventions

- No mention of a tool, a piece of software or a technique. Supersoft is a tool for making software, so the temptation is constant — resist it.
- **These documents change only when the business changes** — never when the tooling changes. Nothing here says what is "already built", "in progress" or "planned".
- Keep it short. A rule nobody can find is a rule nobody follows.

## Language

Unlike a customer project, whose domain documents are written in the language of its own domain experts, Supersoft's are written in English: its domain experts are its makers.

## The documents

- [Project and participants](project.md) — what a project is and who takes part.
- [The domain](domain.md) — the informal material, and the formal description written from it.
- [The solution](solution.md) — features, stories, versions, deployment.

When a new concept appears: define it here first, then add it to the [glossary](../glossary.md) **before** giving it a name anywhere else.
