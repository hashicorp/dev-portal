/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { OpenApiSchemaObject, ParameterProps, ParameterSchema } from '../types'

function getParameterPropsFromParameter(
	param: ParameterSchema
): ParameterProps {
	return { name: param.name, _data: param }
}

function getParameterPropsFromSchemaObject(
	schema: OpenApiSchemaObject,
	key: string
): ParameterProps {
	return { name: key, _data: schema }
}

export { getParameterPropsFromParameter, getParameterPropsFromSchemaObject }
