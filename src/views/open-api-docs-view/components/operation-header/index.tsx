/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { OperationProps } from 'views/open-api-docs-view/types'

/**
 * Renders a header for an operation item,
 * showing the name of the operation in a linkable heading,
 * and showing other metadata such as the request type.
 *
 * TODO: implement this presentation component.
 */
export function OperationHeader({ operation }: { operation: OperationProps }) {
	const { slug, operationId } = operation
	return (
		<div style={{ border: '1px solid magenta' }}>
			<h3 id={slug} className="g-offset-scroll-margin-top">
				{operationId}
			</h3>
		</div>
	)
}
