import { ProductSlug } from 'types/products'

export function getIsEnabledProductIntegrations(productSlug: ProductSlug) {
	return __config.dev_dot.product_slugs_with_integrations.includes(productSlug)
}
