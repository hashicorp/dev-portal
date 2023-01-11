import { MDXRemote } from 'next-mdx-remote'
import Accordion from 'components/accordion'
import Image from 'components/image'
import { ImageProps } from 'components/image/types'
import {
	MdxA,
	MdxP,
	MdxTable,
	MdxInlineCode,
	MdxOrderedList,
	MdxUnorderedList,
	MdxListItem,
	MdxBlockquote,
} from 'components/dev-dot-content/mdx-components'
import { AccordionWithMdxContentProps, AccordionMdxItem } from './types'
import s from './accordion-with-mdx-content.module.css'

function MdxImage({
	alt,
	src,
	title,
}: Pick<ImageProps, 'alt' | 'src' | 'title'>) {
	return <Image alt={alt} src={src} title={title} noBorder={true} />
}

const MDX_COMPONENTS = {
	a: MdxA,
	blockquote: MdxBlockquote,
	p: MdxP,
	table: MdxTable,
	img: MdxImage,
	inlineCode: MdxInlineCode,
	ul: MdxUnorderedList,
	ol: MdxOrderedList,
	li: MdxListItem,
}

export function AccordionWithMdxContent({
	items,
}: AccordionWithMdxContentProps) {
	return (
		<Accordion
			items={items.map((item: AccordionMdxItem, index: number) => {
				/** Default to open the first item, to highlight the interaction */
				const initialOpen = index === 0
				return {
					title: item.title,
					initialOpen,
					content: (
						<div className={s.mdxContentRoot}>
							<MDXRemote {...item.mdxSource} components={MDX_COMPONENTS} />
						</div>
					),
				}
			})}
		/>
	)
}
