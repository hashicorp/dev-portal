import { SidebarBackToLinkProps } from 'components/sidebar/components/sidebar-back-to-link'
import { ProductData, RootDocsPath } from 'types/products'

/**
 * Generate `backToLinkProps` for the current `rootDocsPath`,
 * for use with `DocsView`.
 *
 * TODO: for nested rootDocsPaths, the backToLink props should
 * lead the previous rootDocsPath.
 *
 * A rootDocsPath is considered "nested" if its path contains a slash.
 * If we have a "nested" rootDocsPath, we should try to find the parent
 * rootDocsPath. If we can't find a "parent" rootDocsPath,
 * or if this is not a "nested" rootDocsPath, then we should use
 * a back-to "<product> Home" link.
 */
export function getBackToLink(
	currentRootDocsPath: Pick<RootDocsPath, 'name' | 'path'>,
	product: Pick<ProductData, 'name' | 'slug' | 'rootDocsPaths'>
): SidebarBackToLinkProps {
	return {
		text: `${product.name} Home`,
		href: `/${product.slug}`,
	}
}
