import { activeProductSlugs } from 'lib/products'
import { cachedGetProductData } from 'lib/get-product-data'
import { ProductSlug } from 'types/products'

/**
 * Return an array of product slugs,
 * filtering to include only products integrationsConfig enabled.
 */
export function getProductSlugsWithIntegrations(): ProductSlug[] {
	return activeProductSlugs.filter((productSlug: ProductSlug) => {
		// Pull out the Product Config
		const productData = cachedGetProductData(productSlug)
		// We only want products where integrations are enabled
		return productData.integrationsConfig.enabled
	})
}
