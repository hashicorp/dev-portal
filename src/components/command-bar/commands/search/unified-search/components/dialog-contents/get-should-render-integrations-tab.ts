/**
 * TODO: add description
 */
const PRODUCT_SLUGS_WITH_INTEGRATIONS =
	__config.dev_dot.product_slugs_with_integrations

/**
 * Determine whether the Integrations tab should be rendered.
 */
export function getShouldRenderIntegrationsTab(currentProductTag: $TSFixMe) {
	let shouldRenderIntegrationsTab
	if (PRODUCT_SLUGS_WITH_INTEGRATIONS.length <= 0) {
		// If no products have integrations, do not render it
		shouldRenderIntegrationsTab = false
	} else if (currentProductTag) {
		// If there is a product tag, render it if the product has integrations
		const productHasIntegrations = PRODUCT_SLUGS_WITH_INTEGRATIONS.includes(
			currentProductTag.id
		)
		shouldRenderIntegrationsTab = productHasIntegrations
	} else {
		// Otherwise search is across all products, so render it
		shouldRenderIntegrationsTab = true
	}
	return shouldRenderIntegrationsTab
}
