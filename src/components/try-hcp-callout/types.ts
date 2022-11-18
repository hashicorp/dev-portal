import { ProductSlug } from 'types/products'

/**
 * Only specific product slugs, being those with HCP offerings,
 * can be used with this component.
 */
export type ProductSlugWithContent = Exclude<
	ProductSlug,
	'nomad' | 'sentinel' | 'vagrant'
>

export interface TryHcpCalloutProps {
	productSlug: ProductSlugWithContent
	heading: string
	description: string
	ctaText: string
	ctaUrl: string
}
