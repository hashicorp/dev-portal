import type { OpenAPIV3 } from 'openapi-types'
import { schemaModComponent } from './schema-mod-component'

/**
 * Modifies an expected `protobufAny` OpenAPIV3 schema, replacing some
 * descriptive text in the schema and its properties.
 *
 * This is done as we don't want to display the full descriptions of
 * `protobufAny`, since they were too long in the context of the UI.
 */
function shortenProtobufAnyDescription(
	protobufAnySchema: OpenAPIV3.SchemaObject
): OpenAPIV3.SchemaObject {
	const clonedProtobufAny = { ...protobufAnySchema }
	/**
	 * Modify the description for the `protobufAny` schema
	 * (otherwise it's very very long)
	 */
	if ('description' in clonedProtobufAny) {
		clonedProtobufAny.description =
			'An arbitrary serialized protocol buffer message. See the [protobufAny documentation](https://protobuf.dev/reference/protobuf/google.protobuf/#any) for more information.'
	}
	/**
	 * Modify the description for protobufAny's type property
	 */
	if (
		'properties' in clonedProtobufAny &&
		typeof clonedProtobufAny.properties === 'object'
	) {
		const clonedProtobufAnyType = {
			...clonedProtobufAny.properties['@type'],
		}
		if ('description' in clonedProtobufAnyType) {
			clonedProtobufAnyType.description =
				'A URL that describes the type of the serialized protocol buffer message.'
			clonedProtobufAny.properties = {
				...clonedProtobufAny.properties,
				...{ ['@type']: clonedProtobufAnyType },
			}
		}
	}
	// Return the cloned and modified protobufAny schema
	return clonedProtobufAny
}

/**
 * Modifies an incoming `schemaData`, which is expected to be a valid OpenAPI
 * schema, in order to shorten descriptions in the `protobufAny` schema.
 */
export function schemaModProtobufAny(
	schemaData: OpenAPIV3.Document
): OpenAPIV3.Document {
	return schemaModComponent(
		schemaData,
		'protobufAny',
		shortenProtobufAnyDescription
	)
}
