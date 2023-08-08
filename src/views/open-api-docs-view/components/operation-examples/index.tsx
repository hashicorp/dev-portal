/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// react-components
import CodeBlock from '@hashicorp/react-code-block'
// Styles
import s from './operation-examples.module.css'

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
			/**
			 * TODO: this s.codeBlock should wrap, but it's not yet supported.
			 * `options.wrapCode` prop should be implemented in the CodeBlock
			 * component itself instead.
			 *
			 * Task: https://app.asana.com/0/1204678746647847/1205233741731093/f
			 * PR: https://github.com/hashicorp/react-components/pull/991
			 */
			className={s.codeBlock}
			options={{ heading, showClipboard: true }}
			code={code}
		/>
	)
}
