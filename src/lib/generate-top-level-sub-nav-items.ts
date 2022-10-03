import { ProductSlug } from 'types/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { productSlugsToNames } from 'lib/products'

/**
 * Generates the top-level nav items to be rendered in various places in the
 * app, including `Sidebar`, the home page mobile menu, and the main nav H menu
 * that shows on non-home pages.
 *
 * Depends on the `__config.dev_dot.beta_product_slugs` variable to be set in
 * the current environment config.
 */
export const generateTopLevelSubNavItems = () => {
	const betaProductItems = []
	const futureProductItems = []

	Object.keys(productSlugsToNames).forEach((productSlug: ProductSlug) => {
		// Exclude Sentinel for now
		if (productSlug === 'sentinel') {
			return
		}

		const leadingIconName = productSlug
		const title = productSlugsToNames[productSlug]
		const navItem: $TSFixMe = { leadingIconName, title }
		const isBetaProduct = getIsBetaProduct(productSlug)
		if (isBetaProduct) {
			navItem.href = `/${productSlug}`
			betaProductItems.push(navItem)
		} else {
			navItem.ariaLabel = `Coming soon: ${title}`
			futureProductItems.push(navItem)
		}
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
		...betaProductItems,
		...(futureProductItems.length ? [{ heading: 'Coming Soon' }] : []),
		...futureProductItems,
	]
}
