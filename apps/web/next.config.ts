import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /** A self-contained server, so the prototype runs from its Docker image alone. */
  output: 'standalone',
  /** The monorepo root, so the domain package is traced into that server. */
  outputFileTracingRoot: path.join(__dirname, '../..'),
}

export default nextConfig
