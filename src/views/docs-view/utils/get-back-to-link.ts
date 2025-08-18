/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { SidebarBackToLinkProps } from 'components/sidebar/components/sidebar-back-to-link'
import { getParentRootDocsPath } from 'lib/docs/get-parent-root-docs-path'
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
	 * Handle "nested" rootDocsPaths, for which we want to link back
	 * to the parent rootDocsPath. For example, "/terraform/plugin/framework"
	 * links back to "/terraform/plugin".
	 */
	const parentRootDocsPath = getParentRootDocsPath(
		currentRootDocsPath.path,
		product.rootDocsPaths
	)
	if (parentRootDocsPath) {
		return {
			text: parentRootDocsPath.name,
			href: `/${product.slug}/${parentRootDocsPath.path}`,
		}
	}

	if (product.slug === 'well-architected-framework') {
		return null
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
