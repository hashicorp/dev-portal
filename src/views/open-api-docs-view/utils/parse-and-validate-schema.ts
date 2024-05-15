/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
	fileString: string,
	massageRawSchema?: (schema: unknown) => unknown
): Promise<OpenAPIV3.Document> {
	// Parse the fileString into raw JSON
	const rawSchemaJson = JSON.parse(fileString)
	// Hook to allow  additional schema manipulation before de-referencing
	const hasMassageRawSchema = typeof massageRawSchema === 'function'
	const massagedRawSchema = hasMassageRawSchema
		? massageRawSchema(rawSchemaJson)
		: rawSchemaJson

	// Validate the file string, and up-convert it to OpenAPI 3.0
	const schemaJsonWithRefs = await new OASNormalize(massagedRawSchema).validate(
		{
			convertToLatest: true,
		}
	)

	/**
	 * Dereference the schema.
	 *
	 * For context, in OpenAPI schemas, there are often pointers or references
	 * to shared definitions within the schema. In JSON, these might look like:
	 *
	 * "schema": {
	 * 		"$ref": "#/definitions/..."
	 * }
	 *
	 * Example: https://github.com/hashicorp/hcp-specs/blob/e65c7e982b65ce408ab7e456049a4bf3d5fa7ce0/specs/cloud-vault-secrets/preview/2023-06-13/hcp.swagger.json#L28
	 *
	 * With the full schema file available, these references can be resolved
	 * by looking up the referenced definition and replacing the reference.
	 * For our purposes, it seems preferable to resolve these references
	 * so that we can pass data to presentational components that do not need
	 * to be aware of the full schema file in order to render the data.
	 * After de-referencing, the schema might look like:
	 *
	 * "schema": {
	 * 		"type": "object",
	 * 		"properties": {
	 * 			"some-referenced-stuff": "..."
	 * 		}
	 * }
	 */
	const schemaJson = await new OASNormalize(schemaJsonWithRefs).deref()
	// Return the dereferenced schema.
	// We know it's OpenAPI 3.0, so we cast it to the appropriate type.
	return schemaJson as OpenAPIV3.Document
}
