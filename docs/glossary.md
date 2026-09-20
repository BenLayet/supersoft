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
| Customer | `customer` | commissions and owns the project; their words are the domain's |
| Maker | `maker` | builds and maintains |
| Language of a project | `Project.language` | the customer's; never translated |
| Language Supersoft speaks | `Locale` | chosen by the person; a convenience |
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

## The domain — [domain.md](domain/domain.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Domain | `Domain` | the business the application serves |
| Source | `Source` | informal material, kept as it was given |
| Note / audio / video | `note` / `audio` / `video` | what a source is made of |
| Where a source is kept | `Source.location` | to go back to it as it was given |
| Question | `Question` | something the project knows it does not know |
| Open question | `openQuestions` | unanswered; always countable |
| Subdomain | `Subdomain` | one part of the business, with its own words |
| What a subdomain is | `Subdomain.description` | business only; never what the application does |
| Lexicon | `Term` | one concept, one name, one definition |
| Lexicon of a subdomain | `termsOf` | |
| Description of a subdomain | `rulesOf` | |
| Description | `Rule` | one sentence a customer can confirm or deny |
| Proposed (state) | `proposed` | written, not yet confirmed |
| Agreed (state) | `agreed` | confirmed by the customer |
| Agreeing | `agree` | |
| Rewriting a rule | `restate` | makes it `proposed` again |

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
