import createFetch from '@vercel/fetch'
import { toError } from './to-error'
import { buildQueryStringSuffix } from './build-query-string-suffix'

type uuid = string

const fetch = createFetch(null, { timeout: 900 * 1000 })

interface FetchAllParams<R> {
	endpointUrl: string
	limit?: number
	extraParams?: Record<string, string>
	after?: string
	fetchedRecords?: R[]
}

/**
 * Recursively fetch all records from the database, even if this requires
 * multiple batched requests.
 *
 * If you don't want all the records, pass `recurse: false` and a specified limit.
 * The endpointUrl option specifies which endpoint to hit.
 */
export async function fetchRecursive<T>({
	endpointUrl,
	limit,
	extraParams,
	after,
	fetchedRecords,
}: FetchAllParams<T>): Promise<T[] | undefined> {
	// Set the base array if it's the first call
	if (typeof fetchedRecords === 'undefined') {
		fetchedRecords = []
	}

	const response = await fetchBatch(endpointUrl, after, extraParams)

	if (response.ok) {
		const data = await response.json()
		const allRecords = [...fetchedRecords, ...data.result]

		/**
		 * If recurse is false, we only want the # of records specific by the limit.
		 * If there's less than 100 records fetched in this batch (less than the
		 * max possible),that means that we've fetched everything.
		 */
		const hasEnoughRecords = limit && allRecords.length >= limit
		const hasNoNewRecords = data.result.length === 0
		if (hasEnoughRecords || hasNoNewRecords) {
			console.log(
				`  Fetched ${allRecords.length} records in total. Limit was ${limit}.`
			)
			return allRecords.slice(0, limit)
		}

		console.log(
			`  Fetched ${allRecords.length} records so far, fetching more...`
		)

		// Otherwise, recurse to get the next batch of records
		return fetchRecursive({
			endpointUrl,
			limit,
			// The last ID
			after: data.result[data.result.length - 1].id,
			// Pass the accumulated records
			fetchedRecords: allRecords,
			extraParams,
		})
	}
}

async function fetchBatch(
	endpointUrl: string,
	after?: uuid,
	extraParams?: Record<string, string>
) {
	const queryStringSuffix = buildQueryStringSuffix({ ...extraParams, after })
	const route = endpointUrl + queryStringSuffix

	const response = await fetch(route)

	if (response.ok) {
		return response
	}

	const error = await toError(response)
	throw error
}
