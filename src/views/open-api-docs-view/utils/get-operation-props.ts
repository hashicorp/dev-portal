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
			 *
			 * TODO: update to actually use `summary`, for now we only use
			 * `operationId` as `summary` values are not yet reliably present
			 * & accurate. Task:
			 * https://app.asana.com/0/1204678746647847/1205338583217309/f
			 */
			const summary = addWordBreaks(
				splitOnCapitalLetters(operation.operationId)
			)

			/**
			 * Format and push the operation props
			 */
			operationObjects.push({
				operationId: operation.operationId,
				slug: operationSlug,
				type,
				path: {
					full: path,
					truncated: addWordBreaksToUrl(truncateHcpOperationPath(path)),
				},
				summary,
				requestData,
				responseData,
				urlPathForCodeBlock: getUrlPathCodeHtml(path),
				_placeholder: {
					__type: type,
					__path: path,
					...operation,
				},
			})
		}
	}

	return operationObjects
}
