/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { DevCodeBlock } from '../dev-code-block'
import { PropertyDetails, PropertyDetailsProps } from '../property-details'
import type { OperationProps } from 'views/open-api-docs-view/types'

/**
 * TODO: implement this presentation component.
 */
export function OperationDetails({
	operation,
	requestData,
	responseData,
}: {
	operation: OperationProps
	requestData: { heading: string; propertyDetails: PropertyDetailsProps[] }[]
	responseData: { heading: string; propertyDetails: PropertyDetailsProps[] }[]
}) {
	return (
		<div style={{ border: '1px solid magenta' }}>
			<div>Request</div>
			{requestData.length > 0 ? (
				requestData.map((request) => {
					return (
						<>
							<div>{request.heading}</div>
							{request.propertyDetails.map((property) => {
								return <PropertyDetails key={property.name} {...property} />
							})}
						</>
					)
				})
			) : (
				<div>No request data.</div>
			)}
			<div>Response</div>
			{responseData.length > 0 ? (
				responseData.map((response) => {
					return (
						<>
							<div>{response.heading}</div>
							{response.propertyDetails.map((property) => {
								return <PropertyDetails key={property.name} {...property} />
							})}
						</>
					)
				})
			) : (
				<div>No response data</div>
			)}
			{/* <DevCodeBlock style={{ maxHeight: '500px' }}>
				{JSON.stringify(operation, null, 2)}
			</DevCodeBlock> */}
		</div>
	)
}
