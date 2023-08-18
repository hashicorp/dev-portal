/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Pluggable } from 'unified'
import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'
import rehypePrism from '@mapbox/rehype-prism'

/**
 * Rehype plugins we use across MDX use cases for code syntax highlighting.
 */
export const rehypeCodePlugins: Pluggable[] = [
	[rehypePrism, { ignoreMissing: true, alias: { hcl: ['terraform'] } }],
	rehypeSurfaceCodeNewlines,
]
