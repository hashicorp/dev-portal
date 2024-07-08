/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import DevDotContent from 'components/dev-dot-content'
import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'

interface ParagraphBlockProps {
	mdxSource: MDXRemoteSerializeResult
}

export function ParagraphBlock({ mdxSource }: ParagraphBlockProps) {
	return <DevDotContent mdxRemoteProps={{ ...mdxSource }} />
}
