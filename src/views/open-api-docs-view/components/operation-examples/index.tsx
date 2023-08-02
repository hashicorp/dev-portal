/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// react-components
import CodeBlock from '@hashicorp/react-code-block'
// Types
import type { OperationProps } from 'views/open-api-docs-view/types'
// Styles
import s from './operation-examples.module.css'

/**
 * Display the operation's full URL in an easy to copy code block,
 * as a precursor to more fully built out example requests.
 *
 * TODO: update react-code-block to support wrapping.
 *       at first, just use word-break: anywhere; or whatnot.
 *       later, will make the breaks a little more reasonable with <wbr />.
 *       or... implement HDS code block maybe? is that a thing?
 * TODO: implement <wbr /> for better wrapping.
 * TODO: update code to highlight path parameters
 */
export function OperationExamples({
	operation,
}: {
	operation: OperationProps
}) {
	/**
	 * TODO: extract `heading` as a prop
	 */
	const heading = operation.operationId
	/**
	 * TODO: extract `urlCode` as a prop, this processing should be done
	 * in getStaticProps or whatnot
	 */
	const rawOperationUrl = operation.path.full
	// Insert <wbr/> before forward slashes for more logical line breaks
	const urlWithWordBreaks = rawOperationUrl.replace(/\//g, '/<wbr/>')
	// Add syntax highlighting around any {parameters} in the path
	const parameterRegex = /{([^}]+)}/g
	const urlCode = urlWithWordBreaks.replace(
		parameterRegex,
		'<span class="token regex">{$1}</span>'
	)

	/**
	 * TODO: everything above should be lifted out of this component,
	 * really this is just a pre-configured code block.
	 */
	return (
		<CodeBlock
			/**
			 * TODO: this s.codeBlock style has structure-specific override styles
			 * to force CodeBlock to wrap. `options.wrapCode` prop should be
			 * implemented in the CodeBlock component itself instead.
			 */
			className={s.codeBlock}
			options={{ heading, showClipboard: true }}
			code={urlCode}
		/>
	)
}
