# 0010 — The platform acts through a GitHub App, in the name of the person signed in

**Status**: proposed (2026-10)

## Context

[0008](0008-the-business-is-in-files-the-solution-in-github-issues.md) put each project in a GitHub organisation owned by its domain experts, and left identity and rights to GitHub: the platform grants nothing of its own. Opening a private project, and changing a project's issues, now need someone to sign in.

GitHub offers two ways for a service to act for its users:

- **An OAuth App** acts with everything the person can do. Reading one private repository needs the `repo` scope, which grants reading and writing every private repository the person can reach, code and settings included, in every organisation they belong to. The token does not expire. An organisation may block such apps until an owner approves them.
- **A GitHub App** is installed by an organisation, on the repositories it chooses, with permissions set one by one. Signed in through it, a person gets a token that can do only what both they and the app may do, on the repositories where the app is installed. The token expires after eight hours and is renewed.

Both sign people in the same way, through OAuth. They differ in what the token a person gets may do.

The platform needs to read a project's files, and to read and change its issues. It never needs to write code: [0002](0002-customer-edits-the-specification-never-the-code.md) keeps domain experts out of it, and makers write code with their own tools.

## Decision

1. **The platform is one GitHub App**, registered by `softersoftware`. Its permissions are the ceiling of what the platform can ever do: `Metadata: read`, `Contents: read`, `Pull requests: read`, `Issues: read and write`. A new permission is added when a story needs it, never in advance.

2. **Each organisation installs it once**, on the repositories it chooses. Installing it is an owner's act, like inviting a maker. The platform sees nothing of an organisation that has not installed it.

3. **Signing in is GitHub's own sign-in for the app**, through OAuth with the app's client ID. The person is known by their GitHub account id; the platform keeps no account, password or sign-up of its own. Anyone with a GitHub account can sign in; what they can open still depends on where the app is installed.

4. **The platform acts in the name of the person signed in, never in its own.** Everything it asks of GitHub uses that person's user token, so it can do only what both the person and the app may do. What GitHub refuses them, the platform refuses them, and says why. The platform does not use its installation tokens to act on a project.

5. **Rights are managed on GitHub, nowhere else.** Who may read a repository and who may change its issues are the person's role in the organisation: a domain expert usually needs *Triage*, which lets them write issues and set labels without pushing code. The platform stores no right and offers no screen to grant one.

6. **The token stays on the server**, held for the session as the platform's own state, as 0008 allows. It is never sent to the browser, never logged, never written where a project can read it. Signing out forgets it; losing it means signing in again.

7. **Signing in is a port.** The real adapter speaks to GitHub. The mock adapter signs in as one of a few fictional people, with no outside service, as for every other port.

8. **Public projects still open without signing in**, without a token.

## Consequences

**Easier.** The platform can do, at most, what an organisation installed it for. A leaked token reaches a few chosen repositories, read-only for their code, for a few hours.

**Easier.** Adding a domain expert or a maker is inviting them to the organisation, on GitHub, as today. The platform has nothing to configure.

**Easier.** Everything changed from the platform shows on GitHub as done by the person who did it.

**Easier.** Leaving the platform is uninstalling it. Nothing in any project depends on it, and every right is still where it was.

**Harder.** An organisation must install the platform before its private projects can be opened. Until then, a person who can read a repository on GitHub cannot open it on the platform, and the platform has to say why and how to fix it.

**Harder.** User tokens expire and must be renewed, which an OAuth App would not require.

**Harder.** The platform's own registration on GitHub is something it holds: its private key and secret are production secrets, and losing them means registering again and asking every organisation to reinstall.

**Unchanged.** Opening public projects without signing in stays anonymous, under the limit 0008 noted. Lifting it is left to the story that needs it.
