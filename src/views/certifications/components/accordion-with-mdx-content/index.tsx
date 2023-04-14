/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import Accordion from 'components/accordion'
import DevDotContent from 'components/dev-dot-content'
import Image from 'components/image'
import { ImageProps } from 'components/image/types'
import MdxThemedImage from '../mdx-themed-image'
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
	img: MdxImage,
	ThemedImage: MdxThemedImage,
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
						<DevDotContent
							className={s.mdxContentRoot}
							mdxRemoteProps={{ ...item.mdxSource, components: MDX_COMPONENTS }}
						/>
					),
				}
			})}
		/>
	)
}
