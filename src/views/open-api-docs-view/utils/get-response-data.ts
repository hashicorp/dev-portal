/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third party
import { getReasonPhrase } from 'http-status-codes'

// Utils
import { getPropertyDetailPropsFromSchemaObject } from './get-property-detail-props'
// Types
import type { PropertyDetailsGroup } from '../components/operation-details'
import type { PropertyDetailsProps } from '../components/property-details'
import type { OpenAPIV3 } from 'openapi-types'

/**
 * Given OpenAPI responses data,
 * Return response data formatted for display.
 */
export async function getResponseData(
	responses: OpenAPIV3.ResponsesObject,
	slugPrefix: string
): Promise<PropertyDetailsGroup[]> {
	// Set up an object to hold response data
	const responseData: PropertyDetailsGroup[] = []
	// Populate the responseData object using incoming responses
	for (const responseCode of Object.keys(responses)) {
		/**
		 * OAS files may have multiple response definitions for each response code.
		 * For example, an API that accepts JSON and XML requests will have two
		 * definitions for a 200 response: a valid JSON response and a valid XML
		 * response.
		 **/

		// Grab all the response messages for the current response code
		const codeResponses = responses[responseCode]

		// Skip instances where codeResponses is a $ref
		if ('$ref' in codeResponses) {
			continue
		}

		// Skip instances where codeResponse does not have content
		if (!codeResponses.content) {
			continue
		}

		// Process the parameters etc. for each of the response types (contentType)
		// for the current response code (responseCode)
		for (const [contentType, definition] of Object.entries(
			codeResponses.content
		)) {
			/**
			 * Skip the current object if:
			 *   - The response object is not JSON (for now)
			 *   - The response object definition is a reference
			 *	 - The response object does not include a definition or schema
			 *	 - The response schema is a reference
			 **/
			if (
				contentType !== 'application/json' ||
				contentType.includes('$ref') ||
				!definition ||
				!definition.schema ||
				'$ref' in definition.schema
			) {
				continue
			}

			/**
			 * Note: we expect response schemas to always be objects at their root.
			 * We flatten the response properties to avoid showing a redundant object.
			 */
			if (definition.schema.properties) {
				const responseSlug = `${slugPrefix}_${responseCode}`
				const propertyDetails: PropertyDetailsProps[] = []
				const requiredProperties = definition.schema.required || []

				for (const propertyKey of Object.keys(definition.schema.properties)) {
					const data = definition.schema.properties[propertyKey]
					// If this schema is a reference, skip it
					if ('$ref' in data) {
						continue
					}
					const isRequired = requiredProperties.includes(propertyKey)
					propertyDetails.push(
						await getPropertyDetailPropsFromSchemaObject(
							propertyKey,
							data,
							isRequired,
							responseSlug
						)
					)
				}

				// Determine the heading text to show
				const headingText =
					responseCode === 'default'
						? `Default Error Response`
						: `${responseCode} -  ${getReasonPhrase(responseCode)}`
				const headingTheme = responseCode.startsWith('2')
					? 'success'
					: 'critical'

				responseData.push({
					heading: {
						text: headingText,
						slug: responseSlug,
						theme: headingTheme,
					},
					propertyDetails,
				})
			} // if: definition.schema.properties
		} // for: contentType
	} // for: responseCode
	return responseData
}
