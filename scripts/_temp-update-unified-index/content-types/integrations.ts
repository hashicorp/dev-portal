import createFetch from '@vercel/fetch'
import { NormalizedSearchObject } from '../types'

const fetch = createFetch(null, { timeout: 900 * 1000 })

/**
 * Fetch integrations records to add to our search index.
 *
 * Note: the Integrations API is documented at:
 * https://curly-enigma-8b92ac51.pages.github.io/
 *
 * TODO: support more than 20 records,
 * ie pagination of requests.
 */
async function fetchIntegrations(apiBaseUrl: string, limit?: number) {
	const productSlug = 'waypoint'
	const apiRoute = `/products/${productSlug}/integrations`
	console.log(`Fetching integrations from "${apiRoute}"...`)
	const response = await fetch(apiBaseUrl + apiRoute)
	const { result } = await response.json()
	return limit ? result.slice(0, limit) : result
}

/**
 * Format an integration API record into a normalized search object.
 */
function formatIntegration(integrationRecord): NormalizedSearchObject {
	const integrationSlug = integrationRecord.slug
	const productSlug = integrationRecord.product.slug
	const organizationSlug = integrationRecord.organization.slug
	return {
		objectID: integrationRecord.id,
		description: integrationRecord.description,
		page_title: integrationRecord.name,
		products: [productSlug],
		urlPath: `/${productSlug}/integrations/${organizationSlug}/${integrationSlug}`,
	}
}

export { fetchIntegrations, formatIntegration }
