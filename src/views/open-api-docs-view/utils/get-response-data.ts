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
		const value = responses[responseCode]
		// If this value is a reference, skip it
		if ('$ref' in value) {
			continue
		}
		const definition = value.content['application/json']
		// If this schema is a reference, skip it
		if ('$ref' in definition.schema) {
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
					? `Default Response`
					: `${responseCode} -  ${getReasonPhrase(responseCode)}`

			responseData.push({
				heading: { text: headingText, slug: responseSlug },
				propertyDetails,
			})
		}
	}
	//
	return responseData
}
