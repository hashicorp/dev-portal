/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { OpenAPIV3 } from 'openapi-types'

/**
 * Given an OpenAPI schema, remove the operation at the target path and method.
 * If the path or method does not exist, an error will be thrown.
 */
export function schemaRemoveOperation(
	schemaData: OpenAPIV3.Document,
	path: string,
	method: string
): OpenAPIV3.Document {
	const targetPath = schemaData.paths[path]
	if (!targetPath) {
		throw new Error(
			`schemaRemoveOperation: Path "${path}" not found in schema. Please ensure the provided path is correct, or remove this schemaRemoveOperation modification.`
		)
	}
	const targetOperation = targetPath[method]
	if (!targetOperation) {
		throw new Error(
			`schemaRemoveOperation: "${method}" not found at path "${path}". Please ensure the provided method is correct, or remove this schemaRemoveOperation modification.`
		)
	}
	const clonedPath = { ...targetPath }
	delete clonedPath[method]
	return {
		...schemaData,
		paths: {
			...schemaData.paths,
			[path]: clonedPath,
		},
	}
}
