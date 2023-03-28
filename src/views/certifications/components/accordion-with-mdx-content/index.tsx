/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import NextImage from 'next/image'
import Accordion from 'components/accordion'
import DevDotContent from 'components/dev-dot-content'
import Image from 'components/image'
import { ImageProps } from 'components/image/types'
import { AccordionWithMdxContentProps, AccordionMdxItem } from './types'
import s from './accordion-with-mdx-content.module.css'

function ThemedMdxImage({ alt, src, title, width, height }) {
	return (
		<>
			<span data-hide-on-theme="dark">
				<NextImage
					src={src.light}
					alt={alt}
					title={title}
					width={width}
					height={height}
				/>
			</span>
			<span data-hide-on-theme="light">
				<NextImage
					src={src.dark}
					alt={alt}
					title={title}
					width={width}
					height={height}
				/>
			</span>
		</>
	)
}

function MdxImage({
	alt,
	src,
	title,
}: Pick<ImageProps, 'alt' | 'src' | 'title'>) {
	return <Image alt={alt} src={src} title={title} noBorder={true} />
}

const MDX_COMPONENTS = {
	img: MdxImage,
	ThemedImage: ThemedMdxImage,
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
