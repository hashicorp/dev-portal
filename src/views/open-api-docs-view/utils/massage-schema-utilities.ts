import type { OpenAPIV3 } from 'openapi-types'

/**
 * Replaces "HashiCorp Cloud Platform" with "HCP" in the given string.
 */
export function shortenHcp(s: string): string {
	return s.replace('HashiCorp Cloud Platform', 'HCP')
}

/**
 * Given an OpenAPI schema document,
 * Return the document with the title modified, with any instances of
 * "HashiCorp Cloud Platform" replaced with "HCP".
 */
export function schemaModShortenHcp(
	schemaData: OpenAPIV3.Document
): OpenAPIV3.Document {
	return schemaModTitle(schemaData, shortenHcp)
}

/**
 * Modifies an incoming `schemaData`, which is expected to be a valid OpenAPI
 * schema, in order to make adjustments to the `info.title` property.
 */
export function schemaModTitle(
	schemaData: OpenAPIV3.Document,
	modifyFn: (title: string) => string
): OpenAPIV3.Document {
	return {
		...schemaData,
		info: { ...schemaData.info, title: modifyFn(schemaData.info.title) },
	}
}

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
	return schemaModDefinition(
		schemaData,
		'protobufAny',
		shortenProtobufAnyDescription
	)
}

/**
 * Modifies an incoming OpenAPI document, adjusting the provided reference
 * definition schema according to the provided `modifyFn`.
 */
export function schemaModDefinition(
	schemaData: OpenAPIV3.Document,
	referenceId: string,
	modifyFn: (reference: OpenAPIV3.SchemaObject) => OpenAPIV3.SchemaObject
): OpenAPIV3.Document {
	const referencedSchema = schemaData.components?.schemas[referenceId]
	if (!referencedSchema) {
		throw new Error(`Reference "${referenceId}" not found in schema.`)
	}
	if ('$ref' in referencedSchema) {
		throw new Error(`Target schema ${referenceId} is itself a reference.`)
	} else {
		const modifiedReference = modifyFn(referencedSchema)
		const modifiedSchemas = {
			...schemaData.components.schemas,
			[referenceId]: modifiedReference,
		}
		return {
			...schemaData,
			components: { ...schemaData.components, schemas: modifiedSchemas },
		}
	}
}
