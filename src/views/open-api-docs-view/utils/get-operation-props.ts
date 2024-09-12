/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import slugify from 'slugify'
// Local
import { getRequestData, getResponseData, truncateHcpOperationPath } from './'
// Utils
import { addWordBreaks } from './add-word-breaks'
import { addWordBreaksToUrl } from './add-word-breaks-to-url'
import { splitOnCapitalLetters } from './split-on-capital-letters'
import getUrlPathCodeHtml from './get-url-path-code-html'
// Types
import type { OperationProps } from '../types'
import type { OpenAPIV3 } from 'openapi-types'

/**
 * Given a schema, return a flattened list of operation prop objects.
 */
export async function getOperationProps(
	schemaJson: OpenAPIV3.Document
): Promise<OperationProps[]> {
	// Grab the server URL, we'll use this to build URL paths for each operation
	let serverUrl = ''
	if (schemaJson.servers?.length > 0) {
		const rawServerUrl = schemaJson.servers[0].url
		/**
		 * If we up-converted from an older OpenAPI version, then the spec would
		 * have defined a `host` rather than explicit server URL, and the resulting
		 * server URL will start with `//` rather than a valid protocol.
		 * In this case we assume HTTPs, and update the serverUrl accordingly.
		 */
		serverUrl = rawServerUrl.replace(/^\/\//, 'https://')
	}
	// Set up an accumulator array
	const operationObjects: OperationProps[] = []
	/**
	 * Iterate over all paths in the schema.
	 * Each path can support many operations through different request types.
	 */
	for (const [path, pathItemObject] of Object.entries(schemaJson.paths)) {
		for (const [type, operation] of Object.entries(pathItemObject)) {
			// String values are apparently possible, but not sure how to support them
			if (typeof operation === 'string') {
				continue
			}
			// We only want operation objects.
			if (!('operationId' in operation)) {
				continue
			}

			if (operation.tags?.includes('hidden')) {
				continue
			}

			// Create a slug for this operation
			const operationSlug = slugify(operation.operationId)

			/**
			 * Parse request and response details for this operation
			 */
			const parameters = 'parameters' in operation ? operation.parameters : []
			const requestDataSlug = `${operationSlug}_request`
			const requestData = {
				heading: { text: 'Request', slug: requestDataSlug },
				noGroupsMessage: 'No request data.',
				groups: await getRequestData(
					parameters,
					operation.requestBody,
					requestDataSlug
				),
			}
			const responseDataSlug = `${operationSlug}_response`
			const responseData = {
				heading: { text: 'Response', slug: responseDataSlug },
				noGroupsMessage: 'No response data.',
				groups: await getResponseData(operation.responses, responseDataSlug),
			}

			/**
			 * Build a fallback summary for the operation, which is just
			 * the operationId with some formatting for better line-breaks.
			 * We also apply logic to remove the first part of the operationId,
			 * which by convention will be formatted `ServiceName_OperationName`.
			 *
			 * TODO: update to actually use `summary`, for now we only use
			 * `operationId` as `summary` values are not yet reliably present
			 * & accurate. Task:
			 * https://app.asana.com/0/1204678746647847/1205338583217309/f
			 */
			const operationIdParts = operation.operationId.split('_')
			const hasServicePart = operationIdParts.length > 1
			const idForSummary = hasServicePart
				? operationIdParts.slice(1).join('_')
				: operation.operationId
			const summary = addWordBreaks(splitOnCapitalLetters(idForSummary))

			/**
			 * Format and push the operation props
			 */
			operationObjects.push({
				operationId: operation.operationId,
				slug: operationSlug,
				type,
				tags: operation.tags ?? [],
				path: {
					full: path,
					truncated: addWordBreaksToUrl(truncateHcpOperationPath(path)),
				},
				summary,
				requestData,
				responseData,
				urlPathForCodeBlock: getUrlPathCodeHtml(serverUrl + path),
			})
		}
	}

	return operationObjects
}
