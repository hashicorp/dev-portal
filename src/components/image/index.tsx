/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CSSProperties, ReactElement } from 'react'
import NextImage from 'next/image'
import { GlobalThemeOption } from 'styles/themes/types'
import { ImageProps } from './types'
import classNames from 'classnames'
import s from './image.module.css'

/**
 * Create an object to be passed as a style prop to the underlying img element
 */
function generateStyleProp(
	width: ImageProps['width'],
	height: ImageProps['height']
): Pick<CSSProperties, 'width' | 'height'> {
	const style: Pick<CSSProperties, 'width' | 'height'> = {}

	if (width) {
		style.width = `${width}px`
	}

	if (height) {
		style.height = `${height}px`
	}

	return style
}

/**
 * Returns the values of the width and height query params if present on url.
 */
function getContentApiDimensions(
	url: string
): { width: number; height: number } | null {
	// We only care about Content API urls
	if (!url.startsWith(process.env.MKTG_CONTENT_API)) {
		return null
	}
	const urlParams = new URL(url).searchParams
	const width = urlParams.get('width')
	const height = urlParams.get('height')
	if (width && height) {
		return {
			width: parseInt(width),
			height: parseInt(height),
		}
	}

	return null
}

function getTheme(
	src: string
): GlobalThemeOption.dark | GlobalThemeOption.light | undefined {
	let theme
	// The second arg, the dev-portal url, is arbitrary to satisfy the URL constructor
	const url = new URL(
		decodeURIComponent(src),
		'https://developer.hashicorp.com'
	)
	const themedImageSuffix = new RegExp(/#(dark|light)-theme-only/)

	if (themedImageSuffix.test(url.hash)) {
		const match = url.hash.match(themedImageSuffix)
		// match capture group (dark|light)
		theme = match[1]
	} else if (url.hash) {
		console.warn(
			'[Image]: A hash (#) was detected in src url but it does not match the theme pattern: #{dark|light}-theme-only'
		)
	}

	return theme
}

/**
 * An Image component for use in MDX
 */
function Image({
	src,
	alt,
	title,
	noMargin,
	noBorder,
	height,
	width,
	inline = false,
}: ImageProps): ReactElement {
	/**
	 * Warn if there's no intentional alt prop.
	 *
	 * TODO: determine approach for presentation alt text in MDX
	 * Asana: https://app.asana.com/0/1201987349274776/1202042900781423/f
	 */
	if (typeof alt !== 'string') {
		console.warn(
			`Warning: Found MDX image with undefined alternate text. Even if an image is decorative, it's important for alt to be set to an empty string. Please define alt text the syntax "![Some alt text.](/some-image.jpg)". Image details: ${JSON.stringify(
				{ src, alt, title }
			)}`
		)
	}

	/**
	 * We're passing width and height as style here to ensure they override
	 * any base styles.
	 */
	const style = generateStyleProp(width, height)
	let dimensions = width && height ? { width, height } : null
	if (!dimensions) {
		dimensions = getContentApiDimensions(src)
	}

	const theme = getTheme(src)

	return (
		<span
			className={classNames(s.root, {
				[s.noMargin]: noMargin,
				[s.noBorder]: noBorder,
				[s.inline]: inline,
			})}
			data-show-on-theme={theme ? theme : null}
		>
			{dimensions ? (
				<NextImage
					src={src}
					alt={alt}
					title={title}
					width={dimensions.width}
					height={dimensions.height}
					style={style}
				/>
			) : (
				<img src={src} alt={alt} title={title} style={style} />
			)}
		</span>
	)
}

export default Image
