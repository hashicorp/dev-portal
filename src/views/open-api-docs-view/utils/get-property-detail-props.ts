/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { OpenAPIV3 } from 'openapi-types'
import type { PropertyDetailProps } from '../types'

/**
 * Given a parameter object,
 * Return property detail props.
 *
 * TODO: this is a placeholder, still needs to be implemented.
 */
export function getPropertyDetailPropsFromParameter(
	param: OpenAPIV3.ParameterObject
): PropertyDetailProps {
	return { name: param.name, _placeholder: param }
}

/**
 * Given a schema object,
 * Return property detail props.
 *
 * TODO: this is a placeholder, still needs to be implemented.
 */
export function getPropertyDetailPropsFromSchemaObject(
	schema: OpenAPIV3.SchemaObject,
	key: string
): PropertyDetailProps {
	return { name: key, _placeholder: schema }
}
