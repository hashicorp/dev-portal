/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { OpenAPIV3 } from 'openapi-types'

/**
 * Modifies an incoming OpenAPI document, adjusting the provided reference
 * definition schema according to the provided `modifyFn`.
 */
export function schemaModComponent(
	schemaData: OpenAPIV3.Document,
	componentId: string,
	modifyFn: (reference: OpenAPIV3.SchemaObject) => OpenAPIV3.SchemaObject
): OpenAPIV3.Document {
	const referencedSchema = schemaData.components?.schemas[componentId]
	if (!referencedSchema) {
		//throw new Error(`Reference "${componentId}" not found in schema.`)
		return schemaData
	}
	if ('$ref' in referencedSchema) {
		throw new Error(
			`Target schema ${componentId} is itself a reference, this is unexpected.`
		)
	} else {
		const modifiedReference = modifyFn(referencedSchema)
		const modifiedSchemas = {
			...schemaData.components.schemas,
			[componentId]: modifiedReference,
		}
		return {
			...schemaData,
			components: { ...schemaData.components, schemas: modifiedSchemas },
		}
	}
}
