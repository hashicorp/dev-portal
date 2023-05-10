import createFetch from '@vercel/fetch'
import { getSlugsForRemoteLoader } from './get-slugs-for-remote-loader'

const fetch = createFetch(null, { timeout: 2 * 1000 })

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch docs records to add to our search index.
 */
export async function fetchDocs(
	apiBaseUrl: string,
	limit: number,
	startFrom: number = 0
): Promise<$TSFixMe[]> {
	// Fetch all docs paths
	const apiRoute = '/api/all-docs-paths'
	console.log(`Fetching all docs paths from "${apiRoute}"...`)
	const response = await fetch(apiBaseUrl + apiRoute)
	const { result } = await response.json()
	// For each docs path, fetch content
	const docsPaths = limit ? result.slice(0, limit) : result
	const docsRecords = []
	const failedRecords = []
	for (let i = startFrom; i < docsPaths.length; i++) {
		await sleep(10)
		const uniquePath = docsPaths[i].path
		const [urlProductSlug, urlBasePath, ...restPath] = uniquePath.split('/')
		const { productSlug, basePath } = getSlugsForRemoteLoader(
			urlProductSlug,
			urlBasePath
		)
		const filePath = [basePath, ...restPath].join('/').replace(/\/index$/, '')
		const docApiRoute = `/api/content/${productSlug}/doc/latest/${filePath}`
		const counter = `${String(i + 1).padStart(4)} / ${docsPaths.length}`
		console.log(`${counter} Fetching doc at "${docApiRoute}"...`)
		const docResponse = await fetch(apiBaseUrl + docApiRoute)
		const { result: docResult, meta } = await docResponse.json()
		if (meta.status_code === 200) {
			docsRecords.push({ ...docResult, _uniquePath: uniquePath })
		} else {
			console.log(`  Failed (${meta.status_code}): ${uniquePath}.`)
			failedRecords.push(uniquePath)
		}
	}
	console.log({ failedRecords })
	return docsRecords
}
