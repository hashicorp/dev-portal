/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// react-components
import CodeBlock from '@hashicorp/react-code-block'
// types
import type { ReactNode } from 'react'

/**
 * Display the operation's full URL in an easy to copy code block,
 * as a precursor to more fully built out example requests.
 */
export function OperationExamples({
	heading,
	code,
}: {
	heading: ReactNode
	code: string
}) {
	return (
		<CodeBlock
			/**
			 * TODO: `heading` can be a ReactNode as it is in this case,
			 * but CodeBlock types don't explicitly allow this yet.
			 *
			 * Should make a patch update to CodeBlock that clarifies that
			 * `options.heading` can accept a `ReactNode`, not just `string`.
			 *
			 * Task: https://app.asana.com/0/1202097197789424/1205316467934572/f
			 */
			options={{
				heading: heading as string,
				showClipboard: true,
				wrapCode: true,
			}}
			code={code}
		/>
	)
}
