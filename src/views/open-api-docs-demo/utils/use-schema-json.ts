import { useEffect, useState } from 'react'
import SwaggerParser from '@apidevtools/swagger-parser'
import type { SchemaJson } from '../types'

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
export function useSchemaJson(
	schemaFileString: string
): SchemaJson | { error: string } {
	const [schemaJson, setSchemaJson] = useState<SchemaJson>()

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
				setSchemaJson(schemaJson)
			} catch (err) {
				setSchemaJson({ error: err.message })
			}
		}
		parseSchema()
	}, [schemaFileString])

	// Return the validated, de-referenced schema.
	return schemaJson
}
