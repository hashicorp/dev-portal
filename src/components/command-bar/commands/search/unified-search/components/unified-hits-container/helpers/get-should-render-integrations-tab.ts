/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

/**
 * Pull which products have integrations off of our global config.
 */
const PRODUCT_SLUGS_WITH_INTEGRATIONS =
	__config.dev_dot.product_slugs_with_integrations

/**
 * Given the current product slug,
 * Return `true` if the Integrations search results tab should be rendered,
 * or `false` otherwise.
 */
export function getShouldRenderIntegrationsTab(
	currentProductSlug: ProductSlug
): boolean {
	let shouldRenderIntegrationsTab
	if (PRODUCT_SLUGS_WITH_INTEGRATIONS.length <= 0) {
		// If no products have integrations, do not render it
		shouldRenderIntegrationsTab = false
	} else if (currentProductSlug) {
		// If there is a product tag, render it if the product has integrations
		const productHasIntegrations =
			PRODUCT_SLUGS_WITH_INTEGRATIONS.includes(currentProductSlug)
		shouldRenderIntegrationsTab = productHasIntegrations
	} else {
		// Otherwise search is across all products, so render it
		shouldRenderIntegrationsTab = true
	}
	return shouldRenderIntegrationsTab
}
