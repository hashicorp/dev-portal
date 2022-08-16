import { SidebarBackToLinkProps } from 'components/sidebar/components/sidebar-back-to-link'
import { ProductData, RootDocsPath } from 'types/products'

/**
 * Generate `backToLinkProps` for the current `rootDocsPath`,
 * for use with `DocsView`.
 *
 * For nested rootDocsPaths, the `backToLinkProps` will
 * lead to the "parent" rootDocsPath if there is one.
 *
 * For other cases, the `backToLinkProps` will lead to the product home page.
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
	/**
	 * A rootDocsPath is considered "nested" if it has multiple path parts.
	 */
	const pathParts = currentRootDocsPath.path.split('/')
	const isNestedPath = pathParts.length > 1
	/**
	 * If we have a nested path, we try to find the parent rootDocsPath.
	 * Note that we may not find a match.
	 */
	if (isNestedPath) {
		const parentPath = pathParts.slice(0, pathParts.length - 1).join('/')
		const parentMatches = product.rootDocsPaths.filter((rootDocsPath) => {
			return rootDocsPath.path == parentPath
		})
		if (parentMatches.length > 0) {
			const parentDocsPath = parentMatches[0]
			return {
				text: `${product.name} ${parentDocsPath.name}`,
				href: `/${product.slug}/${parentDocsPath.path}`,
			}
		}
	}
	/**
	 * If we can't find a "parent" rootDocsPath,
	 * or if this is not a "nested" rootDocsPath, then we should use
	 * a generic back-to "<product> Home" link.
	 */
	return {
		text: `${product.name} Home`,
		href: `/${product.slug}`,
	}
}
