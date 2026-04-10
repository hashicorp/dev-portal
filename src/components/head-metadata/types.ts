/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

export interface HeadMetadataProps {
	/**
	 * The title of the current page, will be prepended to the global site title defined in config
	 */
	title?: string

	/**
	 * Description of the current page, render in the meta description tag. Defaults to the value in config
	 */
	description?: string

	/**
	 * Optional custom image path to use as the og-image, relative to
	 * the `/public/og-image` folder.
	 */
	localOgImage?: string

	/**
	 * Optional structured data object to be added to head for LLM parsing
	 */
	structuredData?: {
		'@type': string
		'@context': string
		headline?: string
		name: string
		description?: string
		datePublished?: string
		dateModified?: string
		totalTime?: number
		url?: string
		provider?: {
			'@type': string
			name: string
		},
		hasCourseInstance?: {
			'@type': string
			courseMode: string
		},
		hasPart?: {
			'@type': string
			name: string
		}[],
		author?: {
			'@type': string
			name: string
			url?: string
		}
		tool?: {
			'@type': string
			name: string
		}
		isPartOf?: {
			'@type': string
			name: string
			url?: string
		}
		publisher?: {
			'@type': string
			name: string
		}
		about?: {
			'@type': string
			name: string
		}
	}
}
