import type { OpenAPIV3 } from 'openapi-types'

/**
 * Modifies an incoming `schemaData`, which is expected to be a valid OpenAPI
 * schema, in order to make adjustments to the `info.description` property.
 */
export function schemaModDescription(
	schemaData: OpenAPIV3.Document,
	modifyFn: (description: string) => string
): OpenAPIV3.Document {
	return {
		...schemaData,
		info: {
			...schemaData.info,
			description: modifyFn(schemaData.info.description),
		},
	}
}
