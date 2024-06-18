/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
/**
 * TODO: localize these components to the `v2` folder?
 * or could maybe keep sharing them for now... but `header` for example
 * needs to _not_ be an `h3` (currently hard-coded into the component)
 */
import {
	OperationDetails,
	OperationExamples,
	OperationHeader,
	OperationSections,
} from 'views/open-api-docs-view/components'
// Styles
import s from './operation-contents.module.css'

/**
 * Render the contents of an individual operation view
 *
 * TODO: finish implementing this, `OperationHeader` is off for one thing,
 * since it's an `h3` but should probably be an `h1`, I think?
 */
export default function OperationContents({ operationProps }: $TSFixMe) {
	return (
		<div className={s.root}>
			<OperationSections
				headerSlot={
					<OperationHeader
						slug={operationProps.slug}
						headingText={operationProps.summary}
						method={operationProps.type}
						path={operationProps.path.truncated}
					/>
				}
				examplesSlot={
					<OperationExamples
						heading={operationProps.summary}
						code={operationProps.urlPathForCodeBlock}
					/>
				}
				detailsSlot={
					<OperationDetails
						requestData={operationProps.requestData}
						responseData={operationProps.responseData}
					/>
				}
			/>
		</div>
	)
}
