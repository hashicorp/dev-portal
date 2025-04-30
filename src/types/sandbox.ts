/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'

// Raw configuration in sandbox.json
interface RawSandboxLab {
  title: string
  description: string
  products: string[]
  labId: string
  documentation?: string
}

// Processed version after loading content
export interface SandboxLab {
  title: string
  description: string
  products: string[]
  labId: string
  documentation?: MDXRemoteSerializeResult
}

export interface SandboxConfig {
  products: string[]
  labs: RawSandboxLab[]
} 