# Glossary of business terms

The bridge between the business documentation ([`docs/domain/`](domain/README.md), tool-free) and the code. Every business term used in the domain documents maps here to its name in the code.

Supersoft's domain documents and its code are both in English, so this glossary is not a translation — it fixes **which** English word is used, and forbids the synonyms. Most naming drift in a codebase is not a wrong word; it is three right ones for the same thing.

When a new concept appears: define it first in [`docs/domain/`](domain/README.md), choose its name, and add it here **before** using it in the code.

> A customer project has its own glossary, in its own language. This one is Supersoft's.

## Project and participants — [project.md](domain/project.md)

| Business term | Name in the code | Note |
| --- | --- | --- |
| Project | `Project` | one application, for one customer |
| Participant | `Participant` | anyone taking part |
| Customer | `customer` | commissions and owns the project; their words are the domain's |
| Maker | `maker` | builds and maintains |
| Someone arriving | `Account` | who they are where their projects live |
| Project on offer | `AvailableProject` | what Supersoft found, readable or not |
| Open to everyone | `openToEveryone` | read without saying who you are |
| Written in the form | `inTheForm` | Supersoft can read it |
| Recognised by the project | `guardians` | who may change it |
| May open it | `mayOpen` | |
| May change it | `mayChange` | |
| Where someone left off | `lastOpened` | a convenience, never authority |

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
| Feature | `Feature` | one thing the application offers |
| Stories of a feature | `storiesOf` | a feature with none describes nothing |
| State of a feature | `stateOf` | derived from its stories, never set by hand |
| Story | `Story` | person + intention + reason |
| Reason | `Story.reason` | mandatory |
| Essential / expected / later | `essential` / `expected` / `later` | priority, set by the customer |
| To do / in progress / done | `to_do` / `in_progress` / `done` | |
| What comes next | `nextStory` | the most important story still to do |
| Version | `Version` | gathers done stories |
| Planned / deploying / in real use / failed | `planned` / `deploying` / `live` / `failed` | |
| The version real people use | `versionInUse` | |
| The version that carried a story | `versionCarrying` | |
