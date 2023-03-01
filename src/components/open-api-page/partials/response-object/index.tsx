/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Parameter from '../parameter'
import { SchemaType } from '../../types'

interface ResponseObjectProps {
	/** [Response Object](https://swagger.io/specification/v2/#response-object) data. */
	data?: Record<'schema', SchemaType>
}

function ResponseObject({ data }: ResponseObjectProps): React.ReactElement {
	// `schema` can be empty, which means the response does not return content
	//  We currently only support object responses (ie those that have schema.properties) in the UI
	// Ref: https://swagger.io/specification/v2/#response-object
	if (!data || !data.schema || !data.schema.properties) {
		return <div>No content.</div>
	}
	return (
		<div>
			{Object.keys(data.schema.properties).map((propertyKey, idx) => {
				return (
					<Parameter
						key={propertyKey}
						name={propertyKey}
						data={data.schema.properties[propertyKey]}
						isFirstItem={idx === 0}
						isLastItem={idx === Object.keys(data.schema.properties).length - 1}
					/>
				)
			})}
		</div>
	)
}

export default ResponseObject
