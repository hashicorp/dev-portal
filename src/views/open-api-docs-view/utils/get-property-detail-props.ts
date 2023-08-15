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
 */
export async function getPropertyDetailPropsFromParameter(
	param: OpenAPIV3.ParameterObject,
	slugPrefix: string = 'TODO'
): Promise<PropertyDetailsProps> {
	const slug = `${slugPrefix}_${param.name}`
	const paramSchemaDetails = await getPropertyDetailsFromSchema(
		param.schema,
		slug
	)
	return {
		name: param.name,
		slug,
		type: paramSchemaDetails.typeString,
		// Note that we use the description from the parameter itself,
		// rather than from the parameter's schema.
		description: await markdownToHtml(param.description),
		isRequired: param.required,
		nestedProperties: paramSchemaDetails.nestedProperties,
	}
}

/**
 * Given a schema object,
 * Return property detail props.
 */
export async function getPropertyDetailPropsFromSchemaObject(
	key: string,
	schema: OpenAPIV3.SchemaObject,
	isRequired: boolean,
	parentSlug: string
): Promise<PropertyDetailsProps> {
	const slug = `${parentSlug}_${key}`
	const schemaDetails = await getPropertyDetailsFromSchema(schema, slug, 0)
	return {
		name: key,
		slug,
		type: schemaDetails.typeString,
		description: schemaDetails.description,
		isRequired,
		nestedProperties: schemaDetails.nestedProperties,
	}
}

/**
 * Given a schema object,
 * Return a typeString summarizing the schema,
 * descriptionHtml generated from the schema.description,
 * and an array of nested properties with fully built props.
 */
async function getPropertyDetailsFromSchema(
	schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
	parentSlug: string,
	arrayDepth: number = 0
): Promise<{
	typeString: string
	description?: string
	nestedProperties?: PropertyDetailsProps[]
}> {
	/**
	 * We don't expect reference objects (these should have been resolved already),
	 * but if one pops up, we'll just return a string.
	 */
	if ('$ref' in schema) {
		return { typeString: '$ref' }
	}
	/**
	 * If we have an array type, we need to recurse into the items object.
	 * We'll increase the arrayDepth, this will affect the type string we show.
	 */
	if (schema.type === 'array' && schema.items) {
		return await getPropertyDetailsFromSchema(
			schema.items,
			parentSlug + '-array',
			arrayDepth + 1
		)
	}
	/**
	 * For non-array types, we can build out our data.
	 */
	// Build a string that represents this type
	const typeArraySuffix =
		arrayDepth > 0 ? arrayFrom(arrayDepth, '[]').join('') : ''
	const typeString = `${schema.type}${typeArraySuffix}`
	// Build the description
	const description = await markdownToHtml(schema.description)
	// Build out nested properties, if present
	const hasProperties = schema.type === 'object' && Boolean(schema.properties)
	const nestedProperties: PropertyDetailsProps[] = []
	if (hasProperties) {
		// Note: the object-level schema specifies the required properties
		const requiredProperties = schema.required || []
		// Iterate over the properties, pushing them to the nested properties array,
		// and recursing into the schema for each property as necessary.
		for (const propertyKey of Object.keys(schema.properties)) {
			const property = schema.properties[propertyKey]
			const propertySlug = `${parentSlug}.${propertyKey}`
			const propertyDetails = await getPropertyDetailsFromSchema(
				property,
				propertySlug
			)
			nestedProperties.push({
				name: propertyKey,
				slug: propertySlug,
				type: propertyDetails.typeString,
				description: propertyDetails.description,
				isRequired: requiredProperties.includes(propertyKey),
				nestedProperties: propertyDetails.nestedProperties,
			})
		}
	}
	/**
	 * Return the type string and nested properties
	 */
	return { typeString, description, nestedProperties }
}

/**
 * Create an array of the given length, filled with the given value.
 */
function arrayFrom<T>(length: number, value: T): T[] {
	const array = []
	for (let i = 0; i < length; i++) {
		array.push(value)
	}
	return array
}
