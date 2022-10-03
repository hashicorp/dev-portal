import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'

/**
 * Generates the top-level nav items to be rendered in various places in the
 * app, including `Sidebar`, the home page mobile menu, and the main nav H menu
 * that shows on non-home pages.
 */
export const generateTopLevelSubNavItems = () => {
	const productItems = []

	Object.keys(productSlugsToNames).forEach((productSlug: ProductSlug) => {
		// Exclude Sentinel for now
		if (productSlug === 'sentinel') {
			return
		}

		const leadingIconName = productSlug
		const title = productSlugsToNames[productSlug]
		const href = `/${productSlug}`
		const navItem: $TSFixMe = { leadingIconName, title, href }
		productItems.push(navItem)
	})

	return [
		{
			leadingIconName: 'home',
			title: 'HashiCorp Developer',
			href: '/',
			badge: { color: 'highlight', text: 'Beta' },
		},
		{ divider: true },
		{ heading: 'Products' },
		...productItems,
	]
}
