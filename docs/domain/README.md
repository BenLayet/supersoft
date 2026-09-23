# The Supersoft domain

This folder describes **what Supersoft does**, in the language of the people it serves, with no reference to technical tooling. It is the source of truth for the vocabulary and the business rules:

- it is the **common language** between makers, customers and contributors;
- every business term maps to its name in the code in the [glossary](../glossary.md);
- a business rule that is not written here does not exist.

## What Supersoft is

Supersoft is a **support for the conversation** between a maker and a customer about a web or mobile application. Its method is borrowed from domain-driven design: the business is described, in the customer's words, before it is built.

A project has three parts, and they grow together rather than in sequence:

- **The project** — who is taking part.
- **The business** — what the application serves. Informal on one side: what was said, recorded and asked, kept as it came. Formal on the other: the lexicon and the official description of the business, which is the project's main source of truth.
- **The solution** — what the application does about that business: features, broken into stories, gathered into versions and followed into real use.

Everything it produces belongs to the customer and stays readable without it.

## How a project grows

The aim is an application that fits the business precisely: easy to use, and easy to change. It is reached step by step, always in the same order:

1. **Understand the business.** A short [scope](project.md#scope) says what the application is for; the business is then cut into its parts, and the features are drawn from them.
2. **Describe it precisely.** Each part gets its [lexicon](business.md#the-formal-side) and its [rules](business.md#the-formal-side). The rules are the core of the application, true before any screen exists.
3. **Prototype it with the people who will use it.** A [prototype](solution.md#prototypes) applies the rules, and trying it refines them. It becomes realistic mock-ups: a demonstration, connected to nothing.
4. **Put it in front of real people.** Only once it is validated is it connected to the outside world and delivered as a [version](solution.md#versions).
5. **Keep going, the same way.** Every new feature, and every new part of the business, goes through the same steps.

These steps are a cycle, not a sequence of sections: they come round again for every feature. What they produce stays in three places, whatever step a project is at — the **business** ([workshops, and the domains written from them](business.md)), the **features** that answer it ([the solution](solution.md): stories and prototypes), and the **versions** that reach real people.

## Writing conventions

- No mention of a tool, a piece of software or a technique. Supersoft is a tool for making software, so the temptation is constant — resist it.
- **These documents change only when the business changes** — never when the tooling changes. Nothing here says what is "already built", "in progress" or "planned".
- Keep it short. A rule nobody can find is a rule nobody follows.

## Language

Unlike a customer project, whose domain documents are written in the language of its own domain experts, Supersoft's are written in English: its domain experts are its makers.

## The documents

- [Project and participants](project.md) — what a project is and who takes part.
- [The business](business.md) — the informal material, and the formal description written from it.
- [The solution](solution.md) — features, stories, prototypes, versions.

When a new concept appears: define it here first, then add it to the [glossary](../glossary.md) **before** giving it a name anywhere else.
