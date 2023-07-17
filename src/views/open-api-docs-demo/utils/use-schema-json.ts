import { useEffect, useState } from 'react'
import SwaggerParser from '@apidevtools/swagger-parser'
import type { OpenApiSchema } from '../types'

type ParsedSchema = OpenApiSchema | { error: string }

/**
 * Given a string of JSON, parse it into a schema data object.
 *
 * TODO: handle circular references somehow.
 * Waypoint API schema seems to contain circular references:
 * https://github.com/hashicorp/waypoint/blob/main/pkg/server/gen/server.swagger.json
 * Our focus right now isn't on rendering Waypoint API docs with this new
 * template. The intent it to handle circular references in a future iteration.
 *
 * Docs on circular references from `@apidevtools/swagger-parser`:
 * https://apitools.dev/swagger-parser/docs/#circular-refs
 *
 * Note: we'll need some UI / UX solution for presenting circular references
 * as well, I think!
 */
export function useSchemaJson(schemaFileString: string): ParsedSchema {
	const [schemaJson, setSchemaJson] = useState<ParsedSchema>()

	/**
	 * When the incoming schema file string changes, parse & validate it.
	 */
	useEffect(() => {
		async function parseSchema() {
			try {
				const rawSchemaJson = JSON.parse(schemaFileString)
				const schemaJson = await SwaggerParser.validate(rawSchemaJson, {
					dereference: { circular: false },
				})
				/**
				 * Note: we validate here but don't guarantee an OpenAPI 3.1 schema...
				 * I guess Swagger is a different spec or something? And there
				 * are different / older versions like 3.0 and 3.1?
				 * TODO: update this validation to guarantee an OpenAPI 3.1 schema
				 * Maybe server-side validation would be a good route,
				 * to open up the possible tools we could use beyond
				 * client-side JavaScript:
				 * https://openapi.tools/
				 *
				 * Ugly quick version: check for `openapi` property
				 * on the schemaJson object, should be "3.1".
				 * Notably thought HCP Vault Secrets has "swagger: 2.0",
				 * so maybe we should aim for that rather than aim to support
				 * the latest version of the spec?
				 */
				setSchemaJson(schemaJson as $TSFixMe)
			} catch (err) {
				setSchemaJson({ error: err.message })
			}
		}
		parseSchema()
	}, [schemaFileString])

	// Return the validated, de-referenced schema.
	return schemaJson
}
