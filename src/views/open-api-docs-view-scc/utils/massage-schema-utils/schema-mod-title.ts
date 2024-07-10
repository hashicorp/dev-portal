/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { OpenAPIV3 } from 'openapi-types'

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
