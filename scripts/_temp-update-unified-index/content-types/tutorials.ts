import createFetch from '@vercel/fetch'
import { NormalizedSearchObject } from '../types'

const fetch = createFetch(null, { timeout: 900 * 1000 })

/**
 * Fetch tutorials records to add to our search index.
 *
 * Note: the Learn API is documented at:
 * https://digital-api-specs.vercel.app/learn
 */
async function fetchTutorials(apiBaseUrl: string, limit: number = 5) {
	// Get a specific product; waypoint in this case
	const learnApiProducts = await fetchLearnApiProducts(apiBaseUrl)
	const targetProductSlug = 'waypoint'
	const targetProductId = learnApiProducts.find(
		(p) => p.slug === targetProductSlug
	).id
	// Fetch tutorials for the specific product
	const apiRoute = `/products/${targetProductId}/tutorials`
	console.log(`Fetching tutorials from "${apiRoute}"...`)
	const response = await fetch(apiBaseUrl + apiRoute)
	const { result } = await response.json()
	return result.slice(0, limit)
}

/**
 * Fetch learn API products,
 * this lets us fetch tutorials for a single product,
 * useful for demo purposes.
 *
 * Note: the Learn API is documented at:
 * https://digital-api-specs.vercel.app/learn
 *
 * TODO: support more than 20 records,
 * ie pagination of requests.
 */
async function fetchLearnApiProducts(apiBaseUrl: string) {
	const apiRoute = '/products'
	const response = await fetch(apiBaseUrl + apiRoute)
	const { result } = await response.json()
	return result
}

/**
 * Format a tutorial API record into a normalized search object.
 *
 * Note: only need _some_ fields to be normalized, could extend
 * the `NormalizedSearchObject` interface. For example:
 * TODO: add `headings`, see `collectHeadings` in mktg-content-workflows
 * TODO: add `codeListItems`, see `collectCodeListItems` in mktg-content-workflows
 *
 * TODO: shouldn't really put URL path in search object, I think?
 * But not really sure how else to handle this.
 * I guess varied data by content type? Tutorials need more data
 * to determine the URL path they'll need to link to from search results...
 * Could include `const` items below rather than `urlPath`, I guess.
 */
function formatTutorial(tutorialRecord): NormalizedSearchObject {
	const tutorialSlug = tutorialRecord.slug.split('/')[1]
	const collectionSlug = tutorialRecord.default_collection.slug.split('/')[1]
	const collectionSection = tutorialRecord.default_collection.slug.split('/')[0]
	return {
		objectID: tutorialRecord.id,
		description: tutorialRecord.description,
		page_title: tutorialRecord.name,
		products: tutorialRecord.products_used.map((p) => p.product.slug),
		urlPath: `/${collectionSection}/tutorials/${collectionSlug}/${tutorialSlug}`,
	}
}

export { fetchTutorials, formatTutorial }
