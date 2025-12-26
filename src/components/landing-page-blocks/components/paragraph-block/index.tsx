/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { MDXRemote } from 'lib/next-mdx-remote'
import { MdxA, MdxP } from 'components/dev-dot-content/mdx-components'
import { ParagraphBlockProps } from './types'

const ParagraphBlock = ({ mdxSource }: ParagraphBlockProps) => {
	return <MDXRemote {...mdxSource} components={{ a: MdxA, p: MdxP }} />
}

export type { ParagraphBlockProps }
export { ParagraphBlock }
