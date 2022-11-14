import { MDXRemote } from 'next-mdx-remote'
import { MdxA, MdxP } from 'components/mdx-components'

export function ParagraphBlock(props) {
	return <MDXRemote {...props.mdxSource} components={{ a: MdxA, p: MdxP }} />
}
