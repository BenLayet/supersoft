# Specification

The **specification** describes what an application must do and be. It is written in the language of the people who commissioned it, so that they can read it, correct it, and recognise their own business in it.

It is the source of truth of the project. The [prototype](prototype.md) and the application are consequences of it, never the other way round.

## What it is made of

- the **domain** — the business the application serves: its concepts, the rules that govern them, and the words used to name them;
- the **[brand](brand.md)** — the identity, tone and visual rules of the application;
- the **[stories](stories.md)** — what people do with it, and how we will know it works.

## Ubiquitous language

Every business concept is defined once, in the customer's own words, and that word is then used everywhere: in the specification, in the conversation, in the screens and in the code. A concept has exactly one name.

When the customer's word and the natural technical word differ, the customer's word wins in the specification, and the [glossary](../glossary.md) records what it is called in the code.

**Rule.** A concept gets its glossary entry before it gets a name anywhere else.

## The rules that matter

**A rule not written in the specification does not exist.** If it is not written, it will not be built, and no one is at fault when it is missing. This is what makes the specification worth reading.

**No tooling in the specification.** It says "members can watch a video wherever they are", never how. What the application is made of is a maker's concern, and it changes far more often than the business does.

**The specification changes only when the business changes.** Not when the application changes, not when a tool is replaced.

## The state of a statement

Every statement in the specification carries a state, and the state is visible to everyone:

- **proposed** — written down, not yet agreed;
- **agreed** — the customer has confirmed that this version of it reflects what they want ([agreement](conversation.md)); rewrite the statement and the new version is not agreed until it is agreed in turn;
- **to confirm** — written, but resting on an assumption the maker made and the customer has not yet checked;
- **questioned** — agreed once, now disputed or found wrong;
- **withdrawn** — no longer wanted; kept, with the reason, because the reason is often re-discovered later.

A statement that is **questioned** or **to confirm** is an [open point](conversation.md).

**Rule.** Nothing becomes agreed by silence. Agreement is an act, by the customer, on a named statement as it is written that day, on a date.

## History

Every change to the specification records what changed, when, and at whose request. Earlier versions stay readable.

This exists for one reason above all: six months later, the question is almost never *what* the rule is — it is *why*. A specification that cannot answer "why did we decide this?" loses its value exactly when it is most needed.
