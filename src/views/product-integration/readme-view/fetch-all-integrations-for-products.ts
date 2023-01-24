import { ProductSlug } from 'types/products'
import { Integration } from 'lib/integrations-api-client/integration'
import { fetchAllProductIntegrations } from 'lib/integrations-api-client/integration'

/**
 * An array of productSlugs, each with their full array of
 * corresponding integrations.
 */
export type ProductSlugWithIntegrations = {
	productSlug: ProductSlug
	integrations: Integration[]
}

export async function fetchAllIntegrationsForProducts(
	productSlugs: ProductSlug[]
): Promise<ProductSlugWithIntegrations[]> {
	return await Promise.all(
		productSlugs.map(async (productSlug: ProductSlug) => {
			return {
				productSlug,
				integrations: await fetchAllProductIntegrations(productSlug),
			}
		})
	)
}
