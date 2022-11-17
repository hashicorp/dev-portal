import { ProductSlug } from 'types/products'

export type ProductSlugWithContent = Exclude<
	ProductSlug,
	'nomad' | 'sentinel' | 'vagrant'
>

export interface TryHcpCalloutProps {
	productSlug: Exclude<ProductSlug, 'nomad' | 'sentinel' | 'vagrant'>
	heading: string
	description: string
	ctaText: string
	ctaUrl: string
}
