import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface AccordionMdxItem {
	title: string
	mdxSource: MDXRemoteSerializeResult
}

export interface AccordionWithMdxContentProps {
	items: AccordionMdxItem[]
}
