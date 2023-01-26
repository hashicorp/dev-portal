import { MDXRemote } from 'next-mdx-remote'
import { MdxA, MdxP } from 'components/dev-dot-content/mdx-components'
import { ParagraphBlockProps } from './types'

const ParagraphBlock = ({ mdxSource }: ParagraphBlockProps) => {
	return <MDXRemote {...mdxSource} components={{ a: MdxA, p: MdxP }} />
}

export type { ParagraphBlockProps }
export { ParagraphBlock }
