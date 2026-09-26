# Open any address without putting Supersoft at risk

**As a** maker, **I want** Supersoft to open any address it is given without that address harming it, **so that** it stays up and keeps nothing it should not, whoever uses it.

- Business Value: L
- Effort: M
- State: to do
- Blocked by: A001

## Path

Anyone can give Supersoft any address, and opening it is only a link away. So:

- Opening a repository fetches its structure only. A file is fetched when it is read, and a file larger than 1 MB is not read.
- An address that takes more than 20 seconds to open, or whose copy grows beyond 50 MB, cannot be opened, as if nothing were there.
- At most 4 addresses are opened at once; the others wait their turn.
- No address reaches Supersoft's own network. Only the usual port is allowed, and an address whose machine is local, private, link-local or otherwise not public cannot be opened. Supersoft fetches from the very machine it checked, and follows no redirection.
- What Supersoft keeps from the repositories it opened stays under 1 GB: beyond it, the copies opened least recently are dropped. An address that could not be opened leaves nothing behind. Nothing else limits how long a copy is kept: every opening fetches the repository again anyway.
- Reading a repository depends only on Supersoft's own settings, never on how the machine it runs on is configured.

## Before the story

Any public `https://` address is fetched, whatever its size and wherever it leads. Every copy is kept until the machine restarts, even for an address that could not be opened.

## After the story

Opening an address costs Supersoft a bounded amount of time, space and network, and never reaches anything but a public repository.

## Tests

- Opening a repository fetches its structure, and a file only when it is read.
- A file larger than 1 MB is not read.
- A repository whose copy grows beyond 50 MB, or that takes more than 20 seconds to open, cannot be opened, and Supersoft says so as for any unreadable address.
- A fifth address opened while four are being opened waits until one of them is done.
- An address on `localhost`, on a private network, on a link-local address or with a port of its own cannot be opened, and neither can an address that redirects.
- An address that could not be opened leaves no copy behind.
- Beyond 1 GB, opening a new repository drops the copies opened least recently.
- A setting of the machine Supersoft runs on changes nothing in how a repository is read.
- Opening this repository still works, in production as locally.
