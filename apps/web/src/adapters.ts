import 'server-only'
import { gitProjectFiles, inMemoryProjectFiles } from '@claree/adapters'
import type { ProjectFiles } from '@claree/domain'

/**
 * The adapters the platform runs with. `CLAREE_ADAPTERS=mock` runs it with no
 * outside service at all; otherwise projects are read from their repositories,
 * and repositories on this machine only outside production.
 */
const mock = process.env.CLAREE_ADAPTERS === 'mock'

export const projectFiles: ProjectFiles = mock
  ? inMemoryProjectFiles({
      'https://example.org/medito': {
        'README.md': '# Medito\n\nBooking sessions at a meditation centre.\n',
      },
    })
  : gitProjectFiles({ local: process.env.NODE_ENV !== 'production' })
