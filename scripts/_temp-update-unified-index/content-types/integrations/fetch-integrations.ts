import { fetchRecursive } from '../../utils/fetch-recursive'
import createFetch from '@vercel/fetch'

const fetch = createFetch(null, { timeout: 900 * 1000 })

/**
 * Fetch integrations records to add to our search index.
 *
 * Note: the Integrations API is documented at:
 * https://curly-enigma-8b92ac51.pages.github.io/
 */
export async function fetchIntegrations(apiBaseUrl: string, limit?: number) {
	// Get all products, for each of which we'll fetch integrations
	const products = await getIntegrationProducts(apiBaseUrl)
	// Get integrations for each product, adding to an `allIntegrations` array
	const allIntegrations = []
	for (const product of products) {
		const productSlug = product.slug
		if (productSlug) {
			const productIntegrations = await fetchProductIntegrations(
				apiBaseUrl,
				productSlug,
				limit
			)
			allIntegrations.push(...productIntegrations)
		}
	}
	// Return all integrations
	return allIntegrations
}

/**
 * Fetch all integrations for a specific product, up to an optional limit.
 *
 * Note the `productSlug` must be a slug supported in the integrations API.
 */
async function fetchProductIntegrations(
	apiBaseUrl: string,
	productSlug: string,
	limit?: number
) {
	const apiRoute = `/products/${productSlug}/integrations`
	const endpointUrl = apiBaseUrl + apiRoute
	console.log(`Fetching ${productSlug} integrations from ${endpointUrl}...`)
	const result = await fetchRecursive({
		endpointUrl,
		limit,
		extraParams: { limit: '5' },
	})
	return result
}

/**
 * Fetch all product records for integrations.
 *
 * We can only fetch "all" integrations for individual products,
 * so in order to fetch all integrations across all products,
 * we need to know which product slugs exist in the integrations API.
 */
async function getIntegrationProducts(apiBaseUrl: string) {
	const apiRoute = `/products`
	console.log(`Fetching integration products from "${apiRoute}"...`)
	const response = await fetch(apiBaseUrl + apiRoute)
	const { result } = await response.json()
	console.log(`  Fetched ${result.length} products.`)
	return result
}
