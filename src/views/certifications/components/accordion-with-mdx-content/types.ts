import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { AccordionProps } from 'components/accordion/types'

export interface AccordionMdxItem {
	title: string
	mdxSource: MDXRemoteSerializeResult
}

export interface AccordionWithMdxContentProps {
	items: AccordionMdxItem[]
	activatorHeadingLevel: AccordionProps['activatorHeadingLevel']
}
