import type { OpenAPIV3 } from 'openapi-types'
import { schemaModComponent } from './schema-mod-component'

/**
 * Modifies an expected `protobufAny` OpenAPIV3 schema, replacing some
 * descriptive text in the schema and its properties.
 *
 * This is done as we don't want to display the full descriptions of
 * `protobufAny`, since they were too long in the context of the UI.
 */
export function shortenProtobufAnyDescription(
	protobufAnySchema: OpenAPIV3.SchemaObject
): OpenAPIV3.SchemaObject {
	const clonedProtobufAny = { ...protobufAnySchema }
	/**
	 * Modify the description for the `protobufAny` schema
	 * if it's over 400 characters.
	 */
	if ('description' in clonedProtobufAny) {
		clonedProtobufAny.description = changeIfExceedsCharacterLimit(
			clonedProtobufAny.description,
			400,
			'An arbitrary serialized message. Visit the [protobufAny documentation](https://protobuf.dev/reference/protobuf/google.protobuf/#any) for more information.'
		)
	}
	/**
	 * Modify the description for protobufAny's type property
	 * if it's over 400 characters.
	 */
	if (
		'properties' in clonedProtobufAny &&
		typeof clonedProtobufAny.properties === 'object'
	) {
		const clonedProtobufAnyType = {
			...clonedProtobufAny.properties['@type'],
		}
		if ('description' in clonedProtobufAnyType) {
			clonedProtobufAnyType.description = changeIfExceedsCharacterLimit(
				clonedProtobufAnyType.description,
				400,
				'A URL that describes the type of the serialized message.'
			)
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
 * Given an original string, a character length limit
 * and an alternate string,
 *
 * If the original string exceeds the character length limit,
 * return the alternate string.
 * If the original string does not exceed the character length limit,
 * return the original string.
 */
function changeIfExceedsCharacterLimit(
	original: string,
	characterLimit: number,
	alternate: string
): string {
	return original.length > characterLimit ? alternate : original
}
