import DevDotContent from 'components/dev-dot-content'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

interface ParagraphBlockProps {
	mdxSource: MDXRemoteSerializeResult
}

export function ParagraphBlock({ mdxSource }: ParagraphBlockProps) {
	return <DevDotContent mdxRemoteProps={{ ...mdxSource }} />
}
