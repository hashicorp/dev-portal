/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	OperationDetails,
	OperationExamples,
	OperationHeader,
	OperationSections,
} from '../'
import type {
	OperationGroup,
	OperationProps,
} from 'views/open-api-docs-view/types'
import s from './open-api-operations.module.css'

/**
 * Render operation items for an OpenApiView.
 */
export function OpenApiOperations({
	operationGroups,
}: {
	operationGroups: OperationGroup[]
}) {
	return (
		<div className={s.root}>
			{operationGroups
				.map((group) => group.items)
				.flat()
				.map((operation: OperationProps) => {
					return (
						<div key={operation.operationId}>
							<OperationHeader
								className={s.header}
								slug={operation.slug}
								headerText={operation.operationId}
								method={operation.type}
								path={operation.path.truncated}
							/>
							<OperationSections
								examplesSlot={
									<OperationExamples
										heading={operation.operationId}
										code={operation.urlPathForCodeBlock}
									/>
								}
								detailsSlot={
									<OperationDetails
										requestData={operation.requestData}
										responseData={operation.responseData}
									/>
								}
							/>
						</div>
					)
				})}
		</div>
	)
}
