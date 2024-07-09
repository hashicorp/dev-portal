/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

/**
 * Only specific product slugs, being those with HCP offerings,
 * can be used with this component.
 */
export type ProductSlugWithContent = Exclude<ProductSlug, 'nomad' | 'sentinel'>

export interface TryHcpCalloutProps {
	productSlug: ProductSlugWithContent
	heading: string
	description: string
	ctaText: string
	ctaUrl: string
	image: SVGElement
}

export interface TryHcpCalloutCompactProps {
	productSlug: Exclude<ProductSlugWithContent, 'hcp'>
	heading: string
	description: string
	ctaText: string
	ctaUrl: string
}
