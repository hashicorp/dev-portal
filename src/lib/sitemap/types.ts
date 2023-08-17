/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ISitemapField } from 'next-sitemap'

export type SitemapElement = Omit<
	ISitemapField,
	'alternateRefs' | 'trailingSlash' | 'changefreq'
> & { changefreq?: string }

export type SitemapPriority = 1 | 0.9 | 0.8 | 0.7

export interface SitemapFactoryInput {
	slug: string
	lastmodDate?: string
	priority?: number
	changefreq?: string
}
