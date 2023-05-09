import createFetch from '@vercel/fetch'
import { NormalizedSearchObject } from '../types'

const fetch = createFetch(null, { timeout: 900 * 1000 })

/**
 * Fetch docs records to add to our search index.
 */
async function fetchDocs(
	apiBaseUrl: string,
	limit: number = 5
): Promise<$TSFixMe[]> {
	// Fetch all docs paths
	const apiRoute = '/api/all-docs-paths'
	console.log(`Fetching all docs paths from "${apiRoute}"...`)
	const response = await fetch(apiBaseUrl + apiRoute)
	const { result } = await response.json()
	// For each docs path, fetch content
	/**
	 * TODO: fetch ALL docs paths... maybe? local file cache or something might
	 * be nice, so that I don't have to re-do this on runs.
	 */
	const docsPaths = result
		.filter(({ path }) => path.indexOf('waypoint') === 0)
		.slice(0, limit)
	const docsRecords = []
	for (const pathsEntry of docsPaths) {
		const uniquePath = pathsEntry.path
		const [productSlug, ...restPath] = uniquePath.split('/')
		const docPath = restPath.join('/')
		const docApiRoute = `/api/content/${productSlug}/doc/latest/${docPath}`
		console.log(`Fetching doc at "${docApiRoute}"...`)
		const docResponse = await fetch(apiBaseUrl + docApiRoute)
		const { result: docResult } = await docResponse.json()
		docsRecords.push({ ...docResult, _uniquePath: uniquePath })
	}
	return docsRecords
}

/**
 * Format a docs API record into a normalized search object.
 *
 * Note: only need _some_ fields to be normalized, could extend
 * the `NormalizedSearchObject` interface. For example:
 * TODO: add `headings`, see `collectHeadings` in mktg-content-workflows
 * TODO: add `codeListItems`, see `collectCodeListItems` in mktg-content-workflows
 */
function formatDoc(docsEntry: $TSFixMe): NormalizedSearchObject {
	return {
		objectID: docsEntry.pk,
		description: docsEntry.metadata.description,
		page_title: docsEntry.metadata.page_title,
		products: [docsEntry.product],
		urlPath: `/${docsEntry._uniquePath}`,
	}
}

export { fetchDocs, formatDoc }
