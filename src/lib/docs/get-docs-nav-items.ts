import {
	DocsNavItem,
	ProductData,
	ProductSlug,
	RootDocsPath,
} from 'types/products'

/**
 * Given ProductData for a specific product,
 * Return items to render in a "Documentation" navigation section.
 */
export function getDocsNavItems(
	currentProduct: Pick<ProductData, 'slug' | 'rootDocsPaths' | 'docsNavItems'>
): DocsNavItem[] {
	const { slug, docsNavItems, rootDocsPaths } = currentProduct
	if (!docsNavItems) {
		return rootDocsPaths.map((r: RootDocsPath) => {
			return docsNavItemFromRootDocsPath(r, slug)
		})
	} else {
		return docsNavItems.map((entry: DocsNavItem | string) => {
			if (typeof entry === 'string') {
				const match = rootDocsPaths.find((r: RootDocsPath) => r.path == entry)
				return docsNavItemFromRootDocsPath(match, slug)
			} else {
				return entry
			}
		})
	}
}

/**
 * Given a RootDocsPath, and the corresponding product slug,
 * Return a DocsNavItem for use in navigation sections.
 */
function docsNavItemFromRootDocsPath(
	rootDocsPath: RootDocsPath,
	productSlug: ProductSlug
): DocsNavItem {
	return {
		icon: rootDocsPath.iconName,
		label: rootDocsPath.name,
		fullPath: `/${productSlug}/${rootDocsPath.path}`,
	}
}
