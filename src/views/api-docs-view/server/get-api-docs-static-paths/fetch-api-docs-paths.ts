/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fetchGithubFile from 'lib/fetch-github-file'
import {
	getServicePathSlug,
	getOperationObjects,
	getServiceIds,
} from 'components/open-api-page/utils'
import {
	processSchemaFile,
	processSchemaString,
} from 'components/open-api-page/server/process-schema'
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
async function fetchApiDocsPaths({
	targetFile,
	versionId,
	mayHaveCircularReferences,
}: {
	/**
	 * Specify the target file.
	 *
	 * - Provide a `GithubFile` object to load a file using the GitHub API.
	 * - Provide a `string` file path, relative to the current working directory
	 *   from which the website is run, to load a local file.
	 */
	targetFile: GithubFile | string
	versionId?: string
	/**
	 * The Waypoint API docs have circular references.
	 * We manually try to deal with those. This is a band-aid solution,
	 * it seems to have unintended side-effects when applied to other
	 * products' API docs, and almost certainly merits further investigation.
	 *
	 * Asana task:
	 * https://app.asana.com/0/1202097197789424/1203989531295664/f
	 */
	mayHaveCircularReferences?: boolean
}): Promise<string[][]> {
	/**
	 * Grab the schema.
	 *
	 * If the provided `targetFile` is a string, we'll load from the filesystem.
	 * Else, we assume a remote GitHub file, and load using the GitHub API.
	 *
	 * TODO: would be ideal to validate & properly type the schema, eg with `zod`.
	 * For now, we cast it to the good-enough ApiDocsSwaggerSchema.
	 */
	let schema
	if (typeof targetFile === 'string') {
		schema = await processSchemaFile(targetFile)
	} else {
		const swaggerFile = await fetchGithubFile(targetFile)
		schema = await processSchemaString(swaggerFile)
	}

	/**
	 * Parse out operation objects.
	 *
	 * Each operation object is associated with an operation category, also known
	 * as a "service", and these services are what drive our URL structure.
	 */
	const operationObjects = getOperationObjects(
		schema,
		mayHaveCircularReferences
	)
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

export { fetchApiDocsPaths }
