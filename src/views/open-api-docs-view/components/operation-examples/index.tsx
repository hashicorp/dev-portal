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
	// TODO: extract `heading` as a prop
	const heading = operation.operationId
	// TODO: extract `urlCode` as a prop, this processing should be done
	// in getStaticProps or whatnot
	const rawOperationUrl = operation.path.full
	// Add syntax highlighting around the path {parameters}
	const parameterRegex = /{([^}]+)}/g
	const urlWithParameterHighlights = rawOperationUrl.replace(
		parameterRegex,
		'<span class="token regex">{$1}</span>'
	)
	// Insert <wbr/> to allow line breaks in the path
	const urlCode = urlWithParameterHighlights.replace(/([^<])\//g, '$1/<wbr/>')
	return (
		<CodeBlock
			className={s.codeBlock}
			options={{ heading, showClipboard: true }}
			code={urlCode}
		/>
	)
}
