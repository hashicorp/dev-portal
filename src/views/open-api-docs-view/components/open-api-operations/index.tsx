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

/**
 * Render operation items for an OpenApiView.
 *
 * TODO: implement this presentation component.
 */
export function OpenApiOperations({
	operationGroups,
}: {
	operationGroups: OperationGroup[]
}) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
				border: '1px solid magenta',
			}}
		>
			{operationGroups
				.map((group) => group.items)
				.flat()
				.map((operation: OperationProps) => {
					return (
						<div
							key={operation.operationId}
							style={{ border: '1px solid magenta', padding: '2px' }}
						>
							<OperationHeader operation={operation} />
							<OperationSections
								examplesSlot={<OperationExamples operation={operation} />}
								detailsSlot={<OperationDetails operation={operation} />}
							/>
						</div>
					)
				})}
		</div>
	)
}
