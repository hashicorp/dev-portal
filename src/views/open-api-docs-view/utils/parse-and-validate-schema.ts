import OASNormalize from 'oas-normalize'
import { OpenAPIV3 } from 'openapi-types'

/**
 * Given a fileString representing an OpenAPI schema specification,
 * Return a parsed and validated OpenAPIV3 document.
 *
 * Note that there are multiple possible versions of OpenAPI schemas we
 * may receive as input here. We use the `oas-normalize` package to
 * convert the input to the latest version, and then dereference the
 * schema to resolve any `$ref` references.
 *
 * TODO: not sure if we're actually handling circular references here.
 * This is something we'll likely need to look into for Waypoint API docs.
 * Task: https://app.asana.com/0/1202097197789424/1203989531295664/f
 *
 * The input OpenAPI specification can be in any of the following versions:
 * - OpenAPI 2.0 (formerly known as Swagger)
 * - OpenAPI 3.0
 *
 * Note as well  that the terminology associated with OpenAPI can be confusing.
 * From the OpenAPI website:
 * OpenAPI refers to the specification itself.
 * Swagger refers to tooling for implementing the specification.
 *
 * However, this isn't always consistent, and Swagger is often used to refer
 * to the specification as well, as that's how it was known for version 2.0.
 */
export async function parseAndValidateOpenApiSchema(
	fileString: string
): Promise<OpenAPIV3.Document> {
	// Parse and validate the file string, and up-convert to OpenAPI 3.0
	const rawSchemaJson = await new OASNormalize(fileString).validate({
		convertToLatest: true,
	})
	// Dereference the schema to resolve any `$ref` references
	const schemaJson = await new OASNormalize(rawSchemaJson).deref()
	// Return the dereferenced schema.
	// We know it's OpenAPI 3.0, so we cast it to the appropriate type.
	return schemaJson as OpenAPIV3.Document
}
