/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { SitemapElement, SitemapFactoryInput, SitemapPriority } from './types'

/**
 *
 * @param slug
 * @returns 1 - 0.7 depending on slug depth in relation to a product's base path
 *
 * See XML Tag Definitions: https://www.sitemaps.org/protocol.html
 */
export const determinePriority = (slug: string): SitemapPriority => {
	const slugDepth = slug.split('/').length
	switch (slugDepth) {
		case 1:
			return 1
		case 2:
			return 0.9
		case 3:
			return 0.8
		default:
			return 0.7
	}
}

export const makeSitemapField = (
	{ slug, lastmodDate, priority, changefreq }: SitemapFactoryInput,
	config: typeof __config
): SitemapElement => {
	return {
		loc: new URL(slug, config.dev_dot.canonical_base_url).toString(),
		lastmod: lastmodDate ?? new Date(Date.now()).toISOString(),
		priority: priority ?? determinePriority(slug),
		changefreq: changefreq ?? 'daily',
	}
}
