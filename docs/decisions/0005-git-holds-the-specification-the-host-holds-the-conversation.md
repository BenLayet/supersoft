# 0005 — Git holds the specification; the repository host holds the conversation

**Status**: accepted (2026-09)

## Context

[0001](0001-specification-lives-in-the-project-repository.md) puts a project's specification in its own repository and makes the portal a git client. It does not say what the **repository host** is for: GitHub, GitLab, or any forge a project happens to live on.

The question comes up as soon as the rest of the project is placed. The scope goes in the README and the business goes in `docs/domain/`, but stories, questions, agreements and versions each have a ready-made home on a host. Stories can be issues, questions can be discussions, agreements can be pull request approvals, versions can be releases. Every one of them is tempting, because the host already provides the screens, the notifications and the permissions.

The forces at play:

- **What lives on the host does not travel with the repository.** Issues, reviews, discussions and releases sit in the host's database. `git clone` does not bring them. Moving to another host, or to another maker, means a migration, and a migration is a promise to cooperate later, which is what 0001 exists to avoid.
- **The host already answers questions Supersoft should not answer itself.** Who someone is, and what they are allowed to change in a project, is already known to the host. The specification says Supersoft grants nothing of its own and can only act where the person could already act without it. Taking identity and rights from the host is that rule, implemented.
- **Conversation is not specification.** A remark, a thread about a story, or a review comment is valuable while it is happening. What comes out of it (a rule, an answer, an agreement) is what has to last.
- **Two sources of truth drift.** A story held in an issue and the rules it depends on held in a file have no versioned link between them. Nothing ties the story to the rules as they were when it was written.

## Decision

1. **Everything the specification names is a file in the repository**: scope, sources (or where they are kept), questions, domains with their lexicon and rules, features and their stories, prototypes, agreements, versions. Priority, state and the version that carried a story are attached to the story in its file. None of them is an issue, a discussion, a release or a label.

2. **The repository host is a port, `RepositoryHost`, never a dependency.** Supersoft uses it for three things only:
   - **identity and rights**: who the person is, and whether the project recognises them, is exactly what the host says about their access to the repository;
   - **proposing a change**: a change to the specification is a branch and a pull request, and it becomes part of the project when merged;
   - **conversation**: remarks and discussion around a proposed change live where the host keeps them.

3. **Whatever outlasts a conversation is written back into a file before the conversation ends.** A question answered becomes a rule or a change to one. An agreement becomes an agreement file, as 0001 requires. A host approval, or a merge, is the gesture by which the customer agrees. It is not the record of the agreement, because merge strategies and host migrations can erase who merged and when.

4. **Versions are git tags plus a file.** The tag marks the code; the file names the stories the version carries and its state. A host release, if there is one, is generated from them and never read back.

5. **A project must stay complete if its host disappears.** Losing the host loses past conversations and nothing else. This is the test for any new use of the host: if losing it loses something the specification names, it belongs in a file.

6. **Supersoft's own database, if it ever has one, holds only what can be emptied without any project losing anything.** A cache of what was read from repositories, rebuilt by reading them again. And Supersoft's own state (access tokens, the host accounts it operates for customers, where people left off), whose loss means people signing in again, never a project losing something. Work in progress is a branch, never a row.

## Consequences

Easier:

- Handover stays a copy of the repository, whatever host the project was on, and moving hosts means writing a new adapter, not migrating projects.
- Supersoft grants no permissions of its own. The only accounts it operates are host accounts, and access to a project is managed where the customer already manages it.
- The review and history machinery of the host is used for what it is good at, and a change to the specification travels in the same pull request as the code that implements it.
- The host port gets a mock adapter like every other port, so Supersoft keeps running end-to-end with no host at all.

Harder / accepted costs:

- **Supersoft must provide the screens a host would have given for free**: a backlog, a list of open questions, what comes next. That is the product, so the cost is accepted.
- **Every person who changes a project needs an account on its host**, including customers who have never heard of one. That account must be created for them and used through Supersoft, invisibly. If a customer has to understand the host, the product has failed, as 0001 already says about git.
- **Writing back is a discipline.** A decision made in a comment and never written into a file is lost, silently. Supersoft should show conversations that ended without changing anything, rather than assume someone remembered.
- **Structured files need validation** (story states, priorities, references to versions and to lexicon terms), run as part of the project's build, in the same way 0001 already anticipates.

## Notes

The rejected alternative is to use the host's native objects (issues for stories, releases for versions, approvals for agreements) and have Supersoft render them. It is the fastest way to a working backlog. It also makes every project depend on one host, and makes the portal worthless the day the project moves, which contradicts the reason Supersoft exists.
