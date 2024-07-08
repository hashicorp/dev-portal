/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { MdxPre } from 'components/dev-dot-content/mdx-components/mdx-code-blocks'
import Text from 'components/text'
import InlineLink from 'components/inline-link'

interface MarkdownProps {
	markdown: string
	className?: string
}

export default function Markdown({ markdown, className }: MarkdownProps) {
	return (
		<ReactMarkdown
			className={className}
			components={{
				pre: MdxPre,
				p: ({ node, ...props }) => (
					<Text /* Body/200/Medium */ size={200} weight="medium" {...props} />
				),
				// @ts-expect-error - ignore type mismatch
				a: InlineLink,
			}}
			remarkPlugins={[remarkGfm]}
			//// @ts-expect-error - ignore type mismatch
			// TODO: Serialize and return markdown from the server
			// rehypePlugins={[...rehypeCodePlugins]}
		>
			{markdown}
		</ReactMarkdown>
	)
}
