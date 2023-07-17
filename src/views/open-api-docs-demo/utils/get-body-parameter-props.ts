/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ParameterProps, ParameterSchema } from '../types'
import { getParameterPropsFromSchemaObject } from './get-parameter-props'

function getBodyParamProps(bodyParam: ParameterSchema): ParameterProps[] {
	// Skip reference objects, we expect these to be de-referenced
	// before this function is called
	if ('$ref' in bodyParam) {
		return []
	}
	// Skip the bodyParam.schema if it's a reference
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
		bodyProps.push(getParameterPropsFromSchemaObject(value, key))
	}
	return bodyProps
}

export default getBodyParamProps
