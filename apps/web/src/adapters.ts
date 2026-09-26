import 'server-only'
import { gitProjectFiles, inMemoryProjectFiles } from '@supersoft/adapters'
import type { ProjectFiles } from '@supersoft/domain'

/**
 * The adapters Supersoft runs with. `SUPERSOFT_ADAPTERS=mock` runs it with no
 * outside service at all; otherwise projects are read from their repositories,
 * and repositories on this machine only outside production.
 */
const mock = process.env.SUPERSOFT_ADAPTERS === 'mock'

export const projectFiles: ProjectFiles = mock
  ? inMemoryProjectFiles({
      'https://example.org/medito': {
        'README.md': '# Medito\n\nBooking sessions at a meditation centre.\n',
      },
    })
  : gitProjectFiles({ local: process.env.NODE_ENV !== 'production' })
