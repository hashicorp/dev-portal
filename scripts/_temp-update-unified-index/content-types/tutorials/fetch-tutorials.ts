import { fetchRecursive } from '../../utils/fetch-recursive'

/**
 * Fetch all tutorials records to add to our search index.
 *
 * Note: the Learn API is documented at:
 * https://digital-api-specs.vercel.app/learn
 */
export async function fetchTutorials(apiBaseUrl: string, limit?: number) {
	const apiRoute = `/tutorials`
	console.log(`Fetching tutorials from "${apiRoute}"...`)
	const endpointUrl = apiBaseUrl + apiRoute
	const result = await fetchRecursive({
		endpointUrl,
		limit,
		extraParams: { limit: '20', full: '1' },
	})
	return result
}
