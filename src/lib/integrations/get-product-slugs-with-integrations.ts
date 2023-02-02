import { ProductSlug } from 'types/products'

/**
 * Return an array of product slugs,
 * filtering to include only products integrationsConfig enabled.
 */

export function getProductSlugsWithIntegrations(): ProductSlug[] {
	return __config.dev_dot.product_slugs_with_integrations
}

export function getIsEnabledProductIntegrations(productSlug: ProductSlug) {
	return __config.dev_dot.product_slugs_with_integrations.find(
		(slug: ProductSlug) => productSlug === slug
	)
}
