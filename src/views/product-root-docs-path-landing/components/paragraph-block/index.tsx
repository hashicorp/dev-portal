import { MDXRemote } from 'next-mdx-remote'
import { MdxA, MdxP } from 'components/dev-dot-content/mdx-components'

export function ParagraphBlock(props) {
	return <MDXRemote {...props.mdxSource} components={{ a: MdxA, p: MdxP }} />
}
