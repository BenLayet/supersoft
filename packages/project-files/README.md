# @supersoft/project-files

Adapters for the `ProjectFiles` port of
[`@supersoft/domain`](../domain/README.md): the files of a project, as the
outside world holds them.

A project's specification is a set of files in the project's own repository
([ADR 0001](../../docs/decisions/0001-specification-lives-in-the-project-repository.md)),
so everything Supersoft reads about a project passes through this port.

| Adapter | What it reads |
| --- | --- |
| `inMemoryProjectFiles(files)` | a project described as a map of path to text |
| `fileSystemProjectFiles(root)` | a working copy on a disk |

The in-memory adapter is the mock every port owes
([ADR 0003](../../docs/decisions/0003-hexagonal-monorepo-pure-domain.md) point 4).
It is not a testing convenience: it is what lets a specification be read, and
a prototype be shown, with no repository, no network and no disk.

Paths are project-relative, separated by `/`, never starting with one. A path
that climbs out of the project is refused rather than answered.

Reading a repository over the network, and writing back as commits and pull
requests, are not here yet: they are a port of their own, for the slice that
needs them.
