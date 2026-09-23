# Glossary of business terms

The bridge between the business documentation ([`docs/domain/`](domain/README.md), tool-free) and the code. Every business term used in the domain documents maps here to its name in the code.

Supersoft's domain documents and its code are both in English, so this glossary is not a translation — it fixes **which** English word is used, and forbids the synonyms. Most naming drift in a codebase is not a wrong word; it is three right ones for the same thing.

When a new concept appears: define it first in [`docs/domain/`](domain/README.md), choose its name, and add it here **before** using it in the code.

> A customer project has its own glossary, in its own language. This one is Supersoft's.

## Project and participants — [project.md](domain/project.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Project | `Project` | one application, for one customer |
| Scope | `Project.scope` | short, broad, deliberately vague |
| Participant | `Participant` | anyone taking part |
| Customer | `customer` | commissions and owns the project; their words are the business's |
| Maker | `maker` | builds and maintains |
| Language of a project | `Project.language` | the customer's; never translated |
| Language Supersoft speaks | `Locale` | chosen by the person; a convenience |
| Speaking the project's language | `localeIn` | asked for by the person; translates nothing |
| Someone arriving | `Account` | who they are where their projects live |
| Project on offer | `AvailableProject` | what Supersoft found |
| Address of a project | `address` | where its customer keeps it |
| Public project | `isPublic` | read without saying who you are |
| Private project | `isPublic` false | read only by the people it recognises |
| Recognised by the project | `guardians` | who may change it |
| May open it | `mayOpen` | |
| May change it | `mayChange` | |
| Projects someone added | `addedProjects` | kept for them alone; grants nothing |
| Someone's projects | `projectsFor` | the ones they added and can open |

## The business — [business.md](domain/business.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Business | `Business` | what the application serves |
| Workshop | `Workshop` | one working session and what came out of it |
| Date of a workshop | `Workshop.date` | the day it was held; never rewritten |
| Title of a workshop | `Workshop.title` | what it was about |
| Document | `WorkshopDocument` | one thing a workshop left behind |
| Slides / video / recording / notes / report / transcript | `slides` / `video` / `audio` / `notes` / `report` / `transcript` | the kinds of document |
| Where a document is kept | `WorkshopDocument.location` | to go back to it as it was that day |
| Adding a document | `addDocument` | possible after the day; never rewritten |
| Workshops by date | `workshopsByDate` | most recent first |
| Domain | `Domain` | one part of the business, with its own words |
| What a domain is | `Domain.description` | business only; never what the application does |
| Lexicon | `Term` | one concept, one name, one definition |
| Lexicon of a domain | `termsOf` | |
| Description of a domain | `rulesOf` | |
| Description | `Rule` | one sentence a customer can confirm or deny |
| Proposed (state) | `proposed` | written, not yet confirmed |
| Agreed (state) | `agreed` | confirmed by the customer |
| Agreeing | `agree` | |
| Rewriting a rule | `restate` | makes it `proposed` again |
| Question | `Question` | something the project knows it does not know |
| Domain of a question | `Question.domainId` | every question belongs to exactly one |
| Questions of a domain | `questionsOf` | |
| Open question | `openQuestions` | unanswered; always countable |

## The solution — [solution.md](domain/solution.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Prototype | `Prototype` | the application as it can be tried before it is real |
| Where a prototype is tried | `Prototype.location` | |
| Prototypes of a feature | `prototypesOf` | each belongs to exactly one feature |
| Being tried / validated | `being_tried` / `validated` | |
| Validating a prototype | `validate` | by the customer |
| Mock-up / demonstration | — | a refined prototype, connected to nothing; not in the code yet |
| Feature | `Feature` | one thing the application offers |
| Stories of a feature | `storiesOf` | a feature with none describes nothing |
| State of a feature | `stateOf` | derived from its stories, never set by hand |
| Story | `Story` | person + intention + reason |
| Reason | `Story.reason` | mandatory |
| Essential / expected / later | `essential` / `expected` / `later` | priority, set by the customer |
| To do / in progress / done | `to_do` / `in_progress` / `done` | |
| What comes next | `nextStory` | the most important story still to do |
| Version | `Version` | gathers done stories |
| The version that carried a story | `versionCarrying` | |
