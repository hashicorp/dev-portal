/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utils

import { getUrlPathCodeHtml } from '../../utils/get-url-path-code-html'
import { truncateHcpOperationPath } from '../../utils/truncate-hcp-operation-path'
import { getRequestData } from '../../utils/get-request-data'
import { getResponseData } from '../../utils/get-response-data'
import { slugifyOperationId } from 'views/open-api-docs-view-v2/utils/slugify-operation-id'
// Types
import type { OpenAPIV3 } from 'openapi-types'
import type { OperationContentProps } from '.'
import type { OperationObject } from '../../utils/get-operation-objects'

/**
 * Transform the schemaData into props for an individual operation
 */
export default async function getOperationContentProps(
	operation: OperationObject,
	schemaData: OpenAPIV3.Document
): Promise<OperationContentProps> {
	/**
	 * The API's base URL is used to prefix the operation path,
	 * so users can quickly copy the full path to the operation
	 */
	const apiBaseUrl = getApiBaseUrl(schemaData)
	const operationSlug = slugifyOperationId(operation.operationId)
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
	 * Return the operation content props
	 */
	return {
		operationId: operation.operationId,
		tags: operation.tags,
		slug: operationSlug,
		type: operation.type,
		path: {
			full: operation.path,
			truncated: truncateHcpOperationPath(operation.path),
		},
		requestData: requestData,
		responseData: responseData,
		urlPathForCodeBlock: getUrlPathCodeHtml(apiBaseUrl + operation.path),
	}
}

/**
 * Given some OpenAPI schemaData,
 * Return a string representing the base URL for the API.
 *
 * The base URL is derived from the first server URL in the schemaData.
 *
 * @param schemaData
 * @returns {string} The base URL for the API
 */
function getApiBaseUrl(schemaData: OpenAPIV3.Document): string {
	let baseUrl = ''
	if (schemaData.servers?.length > 0) {
		const rawBaseUrl = schemaData.servers[0].url
		/**
		 * If we up-converted from an older OpenAPI version, then the spec would
		 * have defined a `host` rather than explicit server URL, and the resulting
		 * server URL will start with `//` rather than a valid protocol.
		 * In this case we assume HTTPs, and update the baseUrl accordingly.
		 */
		baseUrl = rawBaseUrl.replace(/^\/\//, 'https://')
	}
	return baseUrl
}
