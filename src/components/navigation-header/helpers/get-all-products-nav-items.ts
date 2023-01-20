import { productSlugs, productSlugsToNames } from 'lib/products'
import { NavigationHeaderItem } from 'components/navigation-header/types'

/**
 * Build an array of nav header links, one for each product except Sentinel
 */
export function getAllProductsNavItems(): NavigationHeaderItem[] {
	const productItems: NavigationHeaderItem[] = []
	for (const productSlug of productSlugs) {
		// Exclude Sentinel for now
		if (productSlug === 'sentinel') {
			continue
		}
		// Push a product link
		productItems.push({
			icon: productSlug,
			label: productSlugsToNames[productSlug],
			path: `/${productSlug}`,
		})
	}
	return productItems
}
