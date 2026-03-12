/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { CSSProperties, ReactElement, useEffect, useState } from 'react'
import NextImage from 'next/image'
import { GlobalThemeOption } from 'styles/themes/types'
import { ImageProps } from './types'
import classNames from 'classnames'
import s from './image.module.css'

const servedFromRequestCache = new Map<string, Promise<string | null>>()
async function fetchImageServedFromHeaders(
	src: string
): Promise<string | null> {
	if (servedFromRequestCache.has(src)) {
		const existingRequest = servedFromRequestCache.get(src)
		if (existingRequest) {
			return existingRequest
		}
	}

	const fetchServedFrom = async () => {
		try {
			const response = await fetch(
				`/api/image-served-from?src=${encodeURIComponent(src)}`
			)

			if (!response.ok) {
				return null
			}

			const payload = (await response.json()) as { servedFrom: string | null }
			return payload?.servedFrom ?? null
		} catch {
			return null
		}
	}

	// we want to cache the promise to avoid multiple requests
	const requestPromise = fetchServedFrom()
	servedFromRequestCache.set(src, requestPromise)

	return requestPromise
}

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
	if (!url.startsWith(process.env.MKTG_CONTENT_DOCS_API)) {
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
	const [servedFrom, setServedFrom] = useState<string | null>(null)

	// In order to display the "Served from" badge, we need to fetch the headers for the image, which re-requesting the image as the html tag <img> loading is handled by the browser and we don't have access to the response headers. This useEffect will fetch the headers and set the "servedFrom" state which will determine if we show the badge and what it says.
	useEffect(() => {
		if (process.env.HASHI_ENV !== 'unified-docs-sandbox') return

		let isCancelled = false

		fetchImageServedFromHeaders(src).then((value) => {
			if (!isCancelled) {
				setServedFrom(value)
			}
		})

		return () => {
			isCancelled = true
		}
	}, [src])

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

	let servedFromBadge = null
	if (process.env.HASHI_ENV === 'unified-docs-sandbox') {
		if (servedFrom === 'current build' || servedFrom === 'production') {
			const icon = servedFrom === 'production' ? '🟢' : '🟡'
			servedFromBadge = (
				<span className={s.servedFromBadge}>
					{icon} {servedFrom.toUpperCase()}
				</span>
			)
		}
	}

	return (
		<span
			className={classNames(s.root, {
				[s.noMargin]: noMargin,
				[s.noBorder]: noBorder,
				[s.inline]: inline,
			})}
			data-show-on-theme={theme ? theme : null}
		>
			{servedFromBadge}
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
