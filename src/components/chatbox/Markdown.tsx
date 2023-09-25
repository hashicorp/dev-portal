import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'

import { MdxPre } from 'components/dev-dot-content/mdx-components/mdx-code-blocks'
import Text from 'components/text'

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
				p: (props) => (
					<Text /* Body/200/Medium */ size={200} weight="medium" {...props} />
				),
			}}
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
		>
			{markdown}
		</ReactMarkdown>
	)
}
