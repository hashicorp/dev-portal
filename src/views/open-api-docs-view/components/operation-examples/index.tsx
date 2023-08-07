/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { DevCodeBlock } from '../dev-code-block'
import type { OperationProps } from 'views/open-api-docs-view/types'

/**
 * TODO: implement this presentation component.
 */
export function OperationExamples({
	operation,
}: {
	operation: OperationProps
}) {
	return (
		<div style={{ border: '1px solid magenta' }}>
			Examples <DevCodeBlock>{JSON.stringify(operation, null, 2)}</DevCodeBlock>
		</div>
	)
}
