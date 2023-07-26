/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { DevCodeBlock } from '../dev-code-block'
import { PropertyDetails, propertyDetailsFromData } from '../'
import type { OperationProps } from 'views/open-api-docs-view/types'

/**
 * TODO: implement this presentation component.
 */
export function OperationDetails({ operation }: { operation: OperationProps }) {
	/**
	 * TODO: split out response data parsing to getStaticProps
	 */
	const responseData = []
	for (const key of Object.keys(operation._placeholder.responses)) {
		const value = operation._placeholder.responses[key]
		const definition = value.content['application/json']
		if (definition.schema.properties) {
			responseData.push({
				heading: key,
				propertyDetails: Object.keys(definition.schema.properties).map(
					(propertyKey) => {
						const data = definition.schema.properties[propertyKey]
						return propertyDetailsFromData(propertyKey, data)
					}
				),
			})
		}
	}

	return (
		<div style={{ border: '1px solid magenta' }}>
			<div>Parameters</div>
			{operation.pathParameters?.length > 0 ? (
				<>
					<div>Path parameters</div>
					{operation.pathParameters.map((param) => {
						const props = propertyDetailsFromData(
							param.name,
							param._placeholder
						)
						return <PropertyDetails key={param.name} {...props} />
					})}
				</>
			) : null}
			{operation.queryParameters?.length > 0 ? (
				<>
					<div>Query parameters</div>
					{operation.queryParameters.map((param) => {
						const props = propertyDetailsFromData(
							param.name,
							param._placeholder
						)
						return <PropertyDetails key={param.name} {...props} />
					})}
				</>
			) : null}
			{operation.bodyParameters?.length > 0 ? (
				<>
					<div>Body parameters</div>
					{operation.bodyParameters.map((param) => {
						const props = propertyDetailsFromData(
							param.name,
							param._placeholder
						)
						return <PropertyDetails key={param.name} {...props} />
					})}
				</>
			) : null}
			{responseData.length > 0 ? (
				<>
					<div>Responses</div>
					{responseData.map((response) => {
						return (
							<>
								<div>{response.heading}</div>
								{response.propertyDetails.map((property) => {
									return <PropertyDetails key={property.name} {...property} />
								})}
							</>
						)
					})}
				</>
			) : null}
			{/* <DevCodeBlock style={{ maxHeight: '500px' }}>
				{JSON.stringify(operation, null, 2)}
			</DevCodeBlock> */}
		</div>
	)
}
