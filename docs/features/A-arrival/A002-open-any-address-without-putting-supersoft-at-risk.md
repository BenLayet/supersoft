# Open any address without putting Supersoft at risk

**As a** maker, **I want** Supersoft to open any address it is given without that address harming it, **so that** it stays up and keeps nothing it should not, whoever uses it.

- Business Value: L
- Effort: M
- State: to do
- Blocked by: A001

## Path

Anyone can give Supersoft any address, and opening it is only a link away. So:

- A repository too large, or too slow to read, cannot be opened, as if nothing were there. Only what the overview reads is fetched, not every file.
- No address reaches Supersoft's own network: an address that leads to a private, local or internal machine, directly or by redirection, cannot be opened.
- What Supersoft keeps from the repositories it opened stays bounded: the oldest copies are dropped, and an address that could not be opened leaves nothing behind.
- Reading a repository depends only on Supersoft's own settings, never on how the machine it runs on is configured.

Open questions: the largest repository Supersoft opens, and how much it keeps from the repositories it opened, and for how long.

## Before the story

Any public `https://` address is fetched, whatever its size and wherever it leads. Every copy is kept until the machine restarts, even for an address that could not be opened.

## After the story

Opening an address costs Supersoft a bounded amount of time, space and network, and never reaches anything but a public repository.

## Tests

- A repository larger than the limit cannot be opened, and Supersoft says so as for any unreadable address.
- An address on `localhost`, a private network or a link-local address cannot be opened, and neither can an address that redirects to one.
- Opening a repository fetches its structure and only the files it reads.
- An address that could not be opened leaves no copy behind.
- Beyond the limit, opening a new repository drops the oldest copy.
- Opening this repository still works, in production as locally.
