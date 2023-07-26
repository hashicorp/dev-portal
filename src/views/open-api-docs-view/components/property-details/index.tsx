/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'
// import { MdxInlineCode } from 'components/dev-dot-content/mdx-components'
// import Badge from 'components/badge'
import { DevCodeBlock } from '../dev-code-block'

/**
 * TODO: move this to getStaticProps
 */
export function propertyDetailsFromData(
	name: string,
	data: $TSFixMe,
	arrayDepth: number = 0
): PropertyDetailsProps {
	//
	if (data.type === 'array' && data.items) {
		return propertyDetailsFromData(name, data.items, arrayDepth + 1)
	}
	//
	const hasProperties = data.type === 'object' && Boolean(data.properties)
	const nestedProperties = hasProperties
		? Object.keys(data.properties).map((propertyKey, idx) => {
				return propertyDetailsFromData(
					propertyKey,
					data.properties[propertyKey]
				)
		  })
		: null
	//
	const typeArraySuffix =
		arrayDepth > 0 ? arrayFrom(arrayDepth, '[]').join('') : ''
	const typeString = `${data.type}${typeArraySuffix}`
	//
	return {
		name,
		type: typeString,
		description: data.description || data.title,
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

type PropertyDetailsProps = {
	name: string
	type: string
	isRequired?: boolean
	description?: string
	nestedProperties?: PropertyDetailsProps[]
}

/**
 * - name string (shown as MDX inline code, with border)
 * - type string (shown as code without border)
 * - (optional) required boolean (shows badge)
 * - (optional) description markdown
 * - (optional) nested properties
 *
 * TODO: will need to support "beta" badge for HCP Packer docs.
 */
export function PropertyDetails({
	name,
	type,
	isRequired,
	description,
	nestedProperties,
}: PropertyDetailsProps) {
	return (
		<div className={s.root}>
			<DevCodeBlock>
				{JSON.stringify(
					{
						name,
						type,
						isRequired,
						description,
						nestedProperties,
					},
					null,
					2
				)}
			</DevCodeBlock>
		</div>
	)
}
