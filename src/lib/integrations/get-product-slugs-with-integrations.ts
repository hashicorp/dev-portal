import { ProductSlug } from 'types/products'

/**
 * Return an array of product slugs,
 * filtering to include only products integrationsConfig enabled.
 */

export function getProductSlugsWithIntegrations(): ProductSlug[] {
	return __config.flags.enabled_integrations_slugs
}

export function getIsEnabledProductIntegrations(productSlug: ProductSlug) {
	return __config.flags.enabled_integrations_slugs.find(
		(slug: ProductSlug) => productSlug === slug
	)
}
