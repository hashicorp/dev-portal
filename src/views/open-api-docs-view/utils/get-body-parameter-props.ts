/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getPropertyDetailPropsFromSchemaObject } from './'
// Types
import type { OpenAPIV3 } from 'openapi-types'
import type { PropertyDetailProps } from '../types'

/**
 * Given the parameter object from a body parameter,
 * which we expect to be an object with a schema if it exists,
 *
 * Return property detail data.
 */
export function getBodyParameterProps(
	bodyParam: OpenAPIV3.ParameterObject
): PropertyDetailProps[] {
	// Skip the bodyParam.schema if it's a reference
	// We don't expect references, but for typing purposes we handle them.
	if ('$ref' in bodyParam.schema) {
		return []
	}
	// We flatten these properties to avoid showing a
	// "collapsed object" UI under the "Body Parameters" section,
	// which would be a bit redundant and annoying to have to expand
	const bodyProps = []
	for (const [key, value] of Object.entries(bodyParam.schema.properties)) {
		// Skip reference objects, we expect these to be de-referenced
		// before this function is called
		if ('$ref' in value) {
			continue
		}
		// Skip read-only properties
		if (value.readOnly) {
			continue
		}
		// Push props
		bodyProps.push(getPropertyDetailPropsFromSchemaObject(value, key))
	}
	return bodyProps
}
