/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utilities
import markdownToHtml from '@hashicorp/platform-markdown-utils/markdown-to-html'
// Types
import type { OpenAPIV3 } from 'openapi-types'
import type { PropertyDetailsProps } from '../components/property-details'

/**
 * Given a parameter object,
 * Return property detail props.
 *
 * TODO: this is a placeholder, still needs to be implemented.
 */
export async function getPropertyDetailPropsFromParameter(
	param: OpenAPIV3.ParameterObject
): Promise<PropertyDetailsProps> {
	return await propertyDetailsFromData(param.name, param)
}

/**
 * Given a schema object,
 * Return property detail props.
 *
 * TODO: this is a placeholder, still needs to be implemented.
 */
export async function getPropertyDetailPropsFromSchemaObject(
	key: string,
	schema: OpenAPIV3.SchemaObject
): Promise<PropertyDetailsProps> {
	return await propertyDetailsFromData(key, schema)
}

/**
 * TODO: move this to getStaticProps
 */
export async function propertyDetailsFromData(
	name: string,
	// TODO: fix up type
	data: $TSFixMe,
	// data: OpenAPIV3.ParameterBaseObject | OpenAPIV3.SchemaObject,
	arrayDepth: number = 0
): Promise<PropertyDetailsProps> {
	//
	const parsedType = data.schema?.type || data.type

	//
	if (parsedType === 'array' && data.items) {
		return await propertyDetailsFromData(name, data.items, arrayDepth + 1)
	}
	//
	const hasProperties = parsedType === 'object' && Boolean(data.properties)
	const nestedProperties: PropertyDetailsProps[] = []
	if (hasProperties) {
		for (const propertyKey of Object.keys(data.properties)) {
			const property = data.properties[propertyKey]
			const propertyDetails = await propertyDetailsFromData(
				propertyKey,
				property
			)
			nestedProperties.push(propertyDetails)
		}
	}
	//
	const typeArraySuffix =
		arrayDepth > 0 ? arrayFrom(arrayDepth, '[]').join('') : ''
	const typeString = `${parsedType}${typeArraySuffix}`
	//
	const rawDescription = data.description || data.title
	const description = await markdownToHtml(rawDescription)
	//
	return {
		name,
		type: typeString,
		description,
		isRequired: data.required,
		nestedProperties,
	}
}

/**
 * TODO: move this somewhere else
 */
function arrayFrom(length, value = null) {
	const array = []
	for (let i = 0; i < length; i++) {
		array.push(value)
	}
	return array
}
