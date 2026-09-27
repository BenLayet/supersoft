# 0008 — The business is in files; the solution is in GitHub issues

**Status**: accepted (2026-09)

## Context

[0005](0005-git-holds-the-specification-the-host-holds-the-conversation.md) put everything the specification names in files, stories included, and kept the repository host for identity, pull requests and conversation. It rejected issues as stories because what lives on a host does not travel with `git clone`.

Writing Supersoft's own stories as files showed what that costs:

- **A story still to do is conversation, not specification.** It is reworded, reordered and split long before anyone builds it. As files, every such change is a commit, and [0006](0006-main-is-production-stories-and-prototypes-are-branches.md) asks for a branch and a pull request each time. A first decision numbered 0008 took stories to do straight to `main`, and was abandoned the same day.
- **A story gathers talk.** Why it was reworded, what the customer meant, which commit carried it, which bug it caused. As files, that talk has nowhere to go, and Supersoft would have to build the screens a host already has.
- **A project must be easy to take over.** Any maker knows issues, labels and milestones. None knows a format of Supersoft's own, however small.
- **Supersoft's projects are on GitHub.** Supporting any host means reading through git, which is slow, needs a disk, and cannot see anything but files. No project needs another host yet.

What 0005 got right still holds. The business (scope, workshops, domains, rules, lexicon) changes with the code that applies it, in the same pull request, and must travel with the repository.

## Decision

1. **The business is in files, in the project's repository**, as [0001](0001-specification-lives-in-the-project-repository.md) says: the scope in `README.md`, workshops in `docs/workshops/`, domains in `docs/domain/`, the lexicon in `docs/glossary.md`, decisions in `docs/decisions/`. A rule still changes in the pull request of the story that needs it.

2. **The solution is in the project's GitHub issues:**
   - **a feature** is an issue labelled `feature`; its **stories** are its sub-issues;
   - **business value and effort** are labels: `value: M`, `effort: S`;
   - **what blocks a story** is GitHub's own "blocked by" between issues;
   - **a story is to do** while open, **in progress** while an open pull request closes it, **done** once closed as completed. Its state is never written by hand. Closed as not planned, it is dropped;
   - **a version being gathered** is a milestone; the stories it carries are those in the milestone.

3. **A version leaves a trace in the repository.** It is a git tag, plus a section of `CHANGELOG.md` listing its stories by number and title, written in the pull request that cuts it. A GitHub release, if there is one, is generated from them.

4. **Supersoft works with GitHub only.** The domain still knows nothing of it. Each port keeps a name from the business and a mock adapter, and only the real adapters speak to GitHub, through its API rather than by cloning. Identity and rights are GitHub's, as in 0005: Supersoft grants nothing of its own.

5. **Each customer's projects live in a GitHub organisation that the customer owns.** The maker is a member, invited by the customer. Taking a project over means inviting another maker; nothing moves. Supersoft's own repository goes first.

6. **A story's branch is named after its issue**: `stories/<number>-<title>`, amending 0006.

7. **Supersoft holds nothing a project needs**, as 0005 said: whatever it stores is a cache or its own state (access tokens, where people left off), never a project's.

This supersedes 0005, and the parts of 0001 that put stories and versions in files.

## Consequences

**Easier.** A story to do is changed in place, by the customer or the maker, without a commit. Its history and its discussion stay attached to it.

**Easier.** A story is linked to the pull request that closes it, to the commits that built it and to the bugs it caused, with no work from Supersoft.

**Easier.** A project is a GitHub repository like any other. A maker who has never heard of Supersoft can take it over the same day.

**Easier.** Reading a project no longer needs a disk or git. Opening an address is a few API calls, and the limits of A002 on cloning disappear.

**Harder.** A project now depends on GitHub. Losing it, or leaving it, loses the backlog and the conversations, not the business, the code or what was delivered, which are in the repository. Other forges import issues with their comments, labels and milestones; sub-issues and "blocked by" may not survive the move.

**Harder.** Projects on other hosts cannot be opened. A new host means new adapters, and a format for stories there.

**Harder.** A story and the rules it relied on are no longer versioned together. The pull request that closes a story holds the changes to the rules it needed, which is enough to see what it was built against.

**Harder.** GitHub limits calls without a token to a few dozen an hour for the whole server. Opening public projects at any scale needs Supersoft to call GitHub with a token of its own.

**Harder.** A customer needs a GitHub account and an organisation. Supersoft has to make both painless, as 0001 already requires of git.

**Harder.** `docs/features/` has to move into issues, and the stories that read it (D001, D002) have to be rewritten.

## Notes

Agreements (a rule agreed, a prototype validated) were files under 0005. Where they are kept is left to the first story that records one.

GitHub's issue types (Feature, Bug) would be clearer than a label, and every project is now in an organisation, where they are available. The label is kept because other forges import it.

GitHub Projects was set aside as a source of truth: it belongs to the organisation rather than the repository, and does not travel with it. It remains a fine view over the issues.
