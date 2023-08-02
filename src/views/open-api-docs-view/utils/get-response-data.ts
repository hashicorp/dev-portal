// Utils
import { getPropertyDetailPropsFromSchemaObject } from './get-property-detail-props'
// Types
import type { PropertyDetailsProps } from '../components/property-details'
import type { OpenAPIV3 } from 'openapi-types'

/**
 * Map known response codes to human-readable headings.
 *
 * If an response code isn't in this map, we use the response code itself
 * as the heading.
 */
const RESPONSE_CODE_HEADINGS: Record<string, string> = {
	'200': 'Successful Response',
	default: 'Default Response',
}

/**
 * Given OpenAPI responses data,
 * Return response data formatted for display.
 */
export async function getResponseData(
	responses: OpenAPIV3.ResponsesObject
): Promise<{ heading: string; propertyDetails: PropertyDetailsProps[] }[]> {
	// Set up an object to hold response data
	const responseData: {
		heading: string
		propertyDetails: PropertyDetailsProps[]
	}[] = []
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
			const propertyDetails: PropertyDetailsProps[] = []
			for (const propertyKey of Object.keys(definition.schema.properties)) {
				const data = definition.schema.properties[propertyKey]
				// If this schema is a reference, skip it
				if ('$ref' in data) {
					continue
				}
				propertyDetails.push(
					await getPropertyDetailPropsFromSchemaObject(propertyKey, data)
				)
			}
			responseData.push({
				heading: RESPONSE_CODE_HEADINGS[responseCode] ?? responseCode,
				propertyDetails,
			})
		}
	}
	//
	return responseData
}
