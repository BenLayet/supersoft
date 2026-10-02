# 0009 — Supersoft is named Clarée

**Status**: accepted (2026-10)

## Context

"Supersoft" was a working name. It says nothing of the method, and "super" boasts, which [the tone](../branding/tone.md) forbids everywhere else.

The people the product serves often come to it worn out by software that is hard to change and never quite right. The name is the first thing they hear. It has to be plain, easy to say in French and in English, and to promise calm rather than power.

The method rests on one idea, Boileau's: *ce qui se conçoit bien s'énonce clairement*. A need written clearly is a need that can be built, changed and handed over.

## Decision

1. **The product is named Clarée.** It carries clarity, and the stillness of water that has settled until it is clear. It is also the name of an Alpine river; the product claims no link with it.

2. **Written "Clarée" wherever a person reads it**, and `claree`, without the accent, wherever a machine does: the package scope `@claree/*`, the variable `CLAREE_ADAPTERS`, file and image names, addresses.

3. **The repository moves to the GitHub organisation `softersoftware`, as `softersoftware/claree`.** Softer Software is the approach; Clarée is the tool that applies it.

4. **Decisions 0001 to 0008 and the workshops keep the name they were written with.** They are history. Everything that describes the product as it is now says Clarée.

## Consequences

**Easier.** The name says what the product is for, in words a customer understands without explanation.

**Harder.** The accent cannot appear in identifiers or addresses, so the name exists in two spellings.

**Harder.** Searching for "Clarée" finds the river and its valley first. The product is reached by its address, not by a search.

**Harder.** Older branches, decisions and transcripts say Supersoft. Anyone reading the history needs this decision to connect the two.
