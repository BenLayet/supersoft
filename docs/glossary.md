# Glossary of business terms

The bridge between the business documentation ([`docs/domain/`](domain/README.md), tool-free) and the code. Every business term used in the domain documents maps here to its name in the code.

Supersoft's domain documents and its code are both in English, so this glossary is not a translation — it fixes **which** English word is used, and forbids the synonyms. Most naming drift in a codebase is not a wrong word; it is three right ones for the same thing.

When a new concept appears: define it first in [`docs/domain/`](domain/README.md), choose its name, and add it here **before** using it in the code. A concept absent from this glossary has no name in the code.

Terms are grouped by subdomain, one section per document in `docs/domain/`.

> A customer project has its own glossary, in its own language, mapping its own business terms to its own code. This one is Supersoft's.

## Common

| Business term | Name in the code | Note |
| --- | --- | --- |
| Project | `Project` | one application, for one customer |
| Participant | `Participant` | anyone taking part in a project |
| Maker | `maker` | builds and maintains; the only role that changes code |
| Customer | `customer` | commissions and owns the project |
| Domain expert | `domainExpert` | authority on business vocabulary |
| End user | `endUser` | uses the application; often not a participant |
| Level | `ParticipationLevel` | reader / commenter / editor / builder |

## Projects and participants — [projects.md](domain/projects.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Exploration (moment) | `exploration` | |
| Agreement (moment) | `agreement` | not to be confused with an `Agreement` on a statement |
| Prototype (moment) | `prototyping` | |
| Real use (moment) | `live` | see [delivery.md](domain/delivery.md) |
| Maintenance (moment) | `maintenance` | |

## Specification — [specification.md](domain/specification.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Specification | `Specification` | the source of truth of a project |
| Statement | `Statement` | one addressable element of a specification |
| Domain (part) | `domain` | the business the application serves |
| Ubiquitous language | `Term` | one concept, one name |
| Proposed (state) | `proposed` | |
| Agreed (state) | `agreed` | |
| To confirm (state) | `to_confirm` | rests on a maker's assumption |
| Questioned (state) | `questioned` | agreed once, now disputed |
| Withdrawn (state) | `withdrawn` | kept, with its reason |
| History | `Revision` | what changed, when, at whose request |

## Brand and style — [brand.md](domain/brand.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Brand | `Brand` | |
| Tone of voice | `tone` | |
| Colour (with a purpose) | `ColorRole` | never a palette without meaning |
| Typography scale | `TypeScale` | |
| Density | `density` | |
| Accessibility commitment | `AccessibilityCommitment` | wins over any brand choice it conflicts with |

## Stories and journeys — [stories.md](domain/stories.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Story | `Story` | person + intention + reason |
| Reason | `Story.reason` | mandatory |
| Journey | `Journey` | ordered stories completing something real |
| Acceptance | `Acceptance` | observable by the customer |
| Essential / expected / later | `essential` / `expected` / `later` | priority, set by the customer |

## Conversation and agreement — [conversation.md](domain/conversation.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Remark | `Remark` | always attached to an element |
| Question | `Question` | a remark naming who must answer |
| Change request | `ChangeRequest` | precise enough to be accepted as written |
| Agreement | `Agreement` | by the customer, on an element, on a date |
| Withdrawn agreement | `withdrawAgreement` | lapses automatically when its element changes |
| Open point | `OpenPoint` | always countable, always visible |
| Refusal | `Refusal` | a remark closed with a stated reason |

## Prototype and demonstration — [prototype.md](domain/prototype.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Prototype | `Prototype` | rebuildable from the specification; disposable |
| Fictional data | `fictionalData` | never real personal data, never "anonymised" real data |
| Awkward case | `edgeCase` | deliberately present in fictional data |
| Scenario | `Scenario` | a prepared path with data arranged |
| Demonstration | `Demonstration` | remarks attach to what was on screen |

## Building by the customer — [customer-building.md](domain/customer-building.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Proposal | `Proposal` | changes the prototype at once, real use only after review |
| Reader / commenter / editor / builder | `reader` / `commenter` / `editor` / `builder` | `ParticipationLevel` |
| Reserved decision | `ReservedDecision` | money, personal data, access rights |

## Real use and handover — [delivery.md](domain/delivery.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Real use | `live` | |
| Drift | `Drift` | specification and application disagree; recorded as an open point |
| Handover | `handover` | a guarantee, needing no cooperation from the maker |

## Shared patterns — [shared-patterns.md](domain/shared-patterns.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Pattern | `Pattern` | |
| Adopting | `adopt` | copies into the project; stays a copy, never linked |
| Contributing | `contribute` | needs the customer's consent |
| Questions it always raises | `Pattern.recurringQuestions` | |
