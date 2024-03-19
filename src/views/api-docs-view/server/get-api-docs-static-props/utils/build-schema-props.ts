/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Libraries
import { capitalCase } from 'change-case'
// Global
import fetchGithubFile from 'lib/fetch-github-file'
import {
	processSchemaFile,
	processSchemaString,
} from 'components/open-api-page/server/process-schema'
import {
	getOperationObjects,
	getServiceIds,
	getServiceId,
	getServicePathSlug,
} from 'components/open-api-page/utils'
// Types
import type { GithubFile } from 'lib/fetch-github-file'
import type { OperationObjectType } from 'components/open-api-page/types'
import type { ApiDocsSwaggerSchema, ApiDocsServiceData } from '../../../types'

/**
 * Given a sourceFile, and optional target `serviceId`,
 * fetch the target swagger `.json` file, parse schema information, and
 * Return the `schema`, `serviceData` for the target `serviceId`,
 * `operationObjects`, and a list of all `serviceId`s.
 *
 * If `serviceId` is not provided, `serviceData` will be null.
 * If `serviceId` is provided, but there is no matched `serviceData`
 * or the assumed `serviceData` does not match the provided `serviceId`
 * (this can happen in single-service cases), then this function
 * returns `{ notFound: true }`, which signals that a 404 page should be shown.
 */
async function buildSchemaProps({
	sourceFile,
	serviceId,
}: {
	sourceFile: GithubFile
	serviceId?: string
}): Promise<
	| {
			schema: ApiDocsSwaggerSchema
			serviceData: ApiDocsServiceData | null
			operationObjects: OperationObjectType[]
			serviceIds: string[]
	  }
	| { notFound: true }
> {
	/**
	 * Grab the schema.
	 *
	 * If the provided `sourceFile` is a string, we'll load from the filesystem.
	 * Else, we assume a remote GitHub file, and load using the GitHub API.
	 *
	 * TODO: would be ideal to validate & properly type the schema, eg with `zod`.
	 * For now, we cast it to the good-enough ApiDocsSwaggerSchema.
	 */
	let schema
	if (typeof sourceFile === 'string') {
		schema = await processSchemaFile(sourceFile)
	} else {
		const swaggerFile = await fetchGithubFile(sourceFile)
		schema = await processSchemaString(swaggerFile)
	}

	/**
	 * TODO: would be ideal to add return types to these two functions.
	 * Slightly outside scope of current work, leaving this alone for now.
	 */
	const operationObjects = getOperationObjects(schema) as OperationObjectType[]
	const serviceIds = getServiceIds(operationObjects) as string[]

	/**
	 * Determine `serviceData`, which may be undefined.
	 *
	 * - For single-service APIs, we'll always use serviceIds[0],
	 *   and `serviceData` will always be defined.
	 *
	 * - For multi-service APIs, we'll use the `serviceId` from the URL.
	 *   If `serviceId` is not set in the URL, then `operationCategory`
	 *   will be undefined, and we'll render an index page.
	 */
	const isSingleService = serviceIds.length === 1
	const targetServiceId = isSingleService
		? getServicePathSlug(serviceIds[0])
		: serviceId
	const serviceMatches: ApiDocsServiceData[] = serviceIds
		.filter((id: string) => getServicePathSlug(id) === targetServiceId)
		.map((serviceId: string) => {
			return {
				name: capitalCase(serviceId),
				slug: getServicePathSlug(serviceId),
				operations: operationObjects.filter(
					(o: OperationObjectType) => getServiceId(o) === serviceId
				),
			}
		})
	const serviceData = serviceMatches.length ? serviceMatches[0] : null

	/**
	 * If we have an explicit serviceId, but we weren't able to
	 * find matching serviceData, then return not found.
	 *
	 * Without this check, we might accidentally render the "landing" view
	 * (or single service view) at unrecognized URLs, as we'd otherwise
	 * return `null` serviceData rather than flag a not-found scenario.
	 */
	if (serviceId && serviceData?.slug !== serviceId) {
		return { notFound: true }
	}

	// Return schema-related data
	return {
		schema,
		serviceData,
		operationObjects,
		serviceIds,
	}
}

export { buildSchemaProps }
