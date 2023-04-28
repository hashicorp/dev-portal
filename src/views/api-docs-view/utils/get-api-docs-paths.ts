import fetchGithubFile from 'lib/fetch-github-file'
import {
	getServicePathSlug,
	getOperationObjects,
	getServiceIds,
} from 'components/open-api-page/utils'
import { processSchemaString } from 'components/open-api-page/server/process-schema'
// Types
import type { GithubFile } from 'lib/fetch-github-file'

/**
 * Given a `targetFile` pointing to a valid OpenAPI Swagger `.json` file,
 *
 * Return an array of path parts representing partial URLs on which
 * we'll want to render OpenAPI documentation for the `targetFile`.
 *
 * Note: path parts will differ based on whether a `versionId` is provided,
 * and will differ if there is only a single "service".
 *
 * Without a `versionId`, path parts returned will include:
 * - [] - for the index page, or a single service page
 * - ['<serviceId>'] - when there are multiple services
 *
 * With a `versionId`, part parts return will include:
 * - ['<versionId>'] - for the index page, or a single service page
 * - ['<versionId>', '<serviceId>'] - when there are multiple services
 */
async function getApiDocsPaths(
	targetFile: GithubFile,
	versionId?: string
): Promise<string[][]> {
	/**
	 * Grab the schema, and parse out operation objects.
	 *
	 * Each operation object is associated with an operation category, also known
	 * as a "service", and these services are what drive our URL structure.
	 */
	const swaggerFile = await fetchGithubFile(targetFile)
	const schema = await processSchemaString(swaggerFile)
	const operationObjects = getOperationObjects(schema)
	const serviceSlugs = getServiceIds(operationObjects).map(getServicePathSlug)

	/**
	 * If this is a single service, rather than render an "index" page at the
	 * landing URL & the single "service" page at a separate `/<service-id>` URL,
	 * we'll render the single "service" page at the landing URL.
	 * So, we return an empty array - we only need the landing URL.
	 *
	 * Otherwise, we have multiple services. We'll render an "index" page at
	 * the landing URL, and individual services at `/<service-id>` URLs.
	 * So, we return all serviceSlugs
	 */
	const isSingleService = serviceSlugs.length === 1
	const allPathParts = isSingleService
		? [[]]
		: [[], ...serviceSlugs.map((s: string) => [s])]

	/**
	 * Add versionParts to the paths, if applicable
	 */
	const versionParts = typeof versionId === 'string' ? [versionId] : []
	return allPathParts.map((restParts: string[]) => [
		...versionParts,
		...restParts,
	])
}

export { getApiDocsPaths }
