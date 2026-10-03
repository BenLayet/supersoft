# 0011 — The product is not named in its own specification

**Status**: accepted (2026-10)

## Context

[0009](0009-supersoft-is-named-claree.md) renamed the product, a month after it was first named. The name may change again.

Each rename so far has reached every document: the business rules, the glossary, the decisions, the stories, the comments in the code. None of them depends on the name. A rule such as "the product grants nothing of its own" is true whatever the product is called, and a rename that rewrites it changes nothing but the history.

The name is still needed where it is the subject: on the product's screens, at the top of the README, in the branding.

## Decision

1. **The specification calls the product "the platform"**, in lower case: the business documents, the glossary, the decisions from 0010 on, the stories and features, and the comments in the code. The glossary gives it its entry.

2. **The name appears only where it is the subject**: the title of the README, `docs/branding/`, and the decision that chooses it.

3. **What the product shows takes its name from one place in the code.** A rename changes that one value, not the screens.

4. **Identifiers keep the name**, as 0009 set them (the package scope, the variable of the adapters, the repository), until a rename asks for its own decision.

5. **Decisions 0001 to 0009 and the workshops keep the names they were written with.** They are history, as 0009 already said of the name before.

"The platform" is chosen because nothing else in the specification uses it. "The application" is what each project builds; "the tool" and "the service" are what stands behind the ports.

## Consequences

**Easier.** A rename touches the README, the branding, one value in the code and the identifiers. The rules, the stories and the decisions are left alone.

**Easier.** The specification reads the same whatever the product is called, and keeps no trace of names that were dropped.

**Harder.** "The platform" is less warm than a name. The specification is where that matters least.

**Harder.** The rule has to be kept: every new rule, story and comment written with the name is a rename to come. The documents and the open stories that use the name today are reworded once.
