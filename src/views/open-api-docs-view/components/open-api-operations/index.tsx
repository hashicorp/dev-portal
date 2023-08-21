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
// Utils
import { splitOnCapitalLetters } from './utils/split-on-capital-letters'
import { addWordBreaks } from './utils/add-word-breaks'
// Styles
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
					const operationIdWithBreaks = addWordBreaks(
						splitOnCapitalLetters(operation.operationId)
					)

					return (
						<div key={operation.operationId}>
							<OperationSections
								headerSlot={
									<OperationHeader
										className={s.header}
										slug={operation.slug}
										headingText={operationIdWithBreaks}
										method={operation.type}
										path={addWordBreaks(
											operation.path.truncated
												.split('/')
												.map((v, idx) => (idx === 0 ? [v] : ['/', v]))
												.flat()
										)}
									/>
								}
								examplesSlot={
									<OperationExamples
										heading={operationIdWithBreaks}
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
