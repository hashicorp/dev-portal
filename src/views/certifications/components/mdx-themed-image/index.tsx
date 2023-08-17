/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import NextImage, { ImageProps as NextImageProps } from 'next/image'
import s from './mdx-themed-image.module.css'

interface MdxThemedImageProps {
	lightSrc: string
	darkSrc: string
	alt: NextImageProps['alt']
	width: NextImageProps['width']
	height: NextImageProps['height']
	title?: NextImageProps['title']
}

export default function MdxThemedImage({
	lightSrc,
	darkSrc,
	alt,
	title,
	width,
	height,
}: MdxThemedImageProps) {
	if (!lightSrc || !darkSrc) {
		throw new Error(
			`[ThemedImage]: Please provide both 'dark' and 'light' src values`
		)
	}
	return (
		<>
			<span data-hide-on-theme="dark" className={s.root}>
				<NextImage
					className={s.image}
					src={lightSrc}
					alt={alt}
					title={title}
					width={width}
					height={height}
				/>
			</span>
			<span data-hide-on-theme="light" className={s.root}>
				<NextImage
					className={s.image}
					src={darkSrc}
					alt={alt}
					title={title}
					width={width}
					height={height}
				/>
			</span>
		</>
	)
}
