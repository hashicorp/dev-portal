/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// react-components
import CodeBlock from '@hashicorp/react-code-block'

/**
 * Display the operation's full URL in an easy to copy code block,
 * as a precursor to more fully built out example requests.
 */
export function OperationExamples({
	heading,
	code,
}: {
	heading: string
	code: string
}) {
	return (
		<CodeBlock
			options={{ heading, showClipboard: true, wrapCode: true }}
			code={code}
		/>
	)
}
