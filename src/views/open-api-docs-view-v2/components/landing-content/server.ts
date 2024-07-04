/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { OpenAPIV3 } from 'openapi-types'
import type { LandingContentProps } from '.'

/**
 * TODO: transform the schemaData into useful props
 */
export default async function getLandingContentProps(
	schemaData: OpenAPIV3.Document
): Promise<LandingContentProps> {
	return {
		_placeholder: {
			viewToImplement: 'Landing view for OpenAPI spec',
			schemaSample: schemaData.info,
		},
	}
}
