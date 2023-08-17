/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MDXRemote } from 'next-mdx-remote'
import { MdxA, MdxP } from 'components/dev-dot-content/mdx-components'
import { ParagraphBlockProps } from './types'

const ParagraphBlock = ({ mdxSource }: ParagraphBlockProps) => {
	// @ts-expect-error -- The next-mdx-remote types are wrong here, we don't want a record of ReactNode
	return <MDXRemote {...mdxSource} components={{ a: MdxA, p: MdxP }} />
}

export type { ParagraphBlockProps }
export { ParagraphBlock }
