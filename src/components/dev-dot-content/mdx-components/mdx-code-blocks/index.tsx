/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Children } from 'react'
import classNames from 'classnames'
import CodeBlock from '@hashicorp/react-design-system-components/src/components/code-block'
import Tabs, { Tab } from 'components/tabs'
import { getLanguageName } from './utils'
import type { PropsWithChildren, ReactNode } from 'react'
import s from './mdx-code-blocks.module.css'

interface CodeBlockOptions {
	showChrome?: boolean
	highlight?: string
	lineNumbers?: boolean
	showClipboard?: boolean
	showWindowBar?: boolean
	filename?: string
	heading?: string
	wrapCode?: boolean
}

interface CodeBlockProps {
	className?: string
	code: ReactNode
	language?: string
	theme?: 'light' | 'dark'
	hasBarAbove?: boolean
	options?: CodeBlockOptions
}

interface CodeBlockConfigProps extends CodeBlockProps, CodeBlockOptions {
	children?: ReactNode
	hideClipboard?: boolean
}

function CodeBlockConfig({
	className,
	children,
	hasBarAbove,
	heading,
	filename,
	highlight,
	lineNumbers,
	hideClipboard,
}: CodeBlockConfigProps) {
	return (
		<CodeBlock
			className={className}
			value={childrenOfFirstChild(childrenOfFirstChild(children))}
			isStandalone={!hasBarAbove}
			title={heading ?? filename ?? ''}
			highlightLines={highlight}
			hasLineNumbers={lineNumbers ?? false}
			hasCopyButton={!hideClipboard}
		/>
	)
}

/**
 * Re-exports react-code-block <CodeBlockConfig />, for naming consistency.
 */
export const MdxCodeBlockConfig = CodeBlockConfig

/**
 * Adds spacing specific to Dev Dot to react-code-block <CodeTabs/>.
 */
export function MdxCodeTabs({ children }: { children: ReactNode }) {
	const childCodeBlocks = Children.toArray(children)

	return (
		<Tabs>
			{childCodeBlocks.map((child) => {
				if (!(typeof child === 'object' && 'props' in child)) return null
				const { mdxType, ...restprops } = child.props
				const languageClass =
					mdxType === 'pre' || mdxType === 'CodeBlockConfig'
						? restprops.children.props.className
						: `language-${restprops.language}`
				const slugFromClass = languageClass.split('-')[1]
				const heading = getLanguageName(slugFromClass) ?? slugFromClass

				return (
					<Tab key={slugFromClass} heading={heading} group={slugFromClass}>
						{child}
					</Tab>
				)
			})}
		</Tabs>
	)
}

interface MdxPreProps extends PropsWithChildren {
	className?: string
	hasBarAbove?: boolean
	theme?: 'light' | 'dark'
}

/**
 * Non-highlighted code in MDX needs to be tweaked
 * to work as expected with our code-block component.
 *
 * @param {*} codeChildren React element children, which may be a plain string
 * @returns
 */
function normalizePlainCode(codeChildren: ReactNode) {
	// Highlighted code is not a concern, we handle all related issues
	// with remark and rehype plugins in nextjs-scripts
	if (typeof codeChildren !== 'string') return codeChildren
	return (
		codeChildren
			// Non-highlighted code, which appears as a plain string in MDX,
			// seems to have an extra trailing newline. We remove it.
			.replace(/\n$/, '')
			// Non-highlighted code also needs to have its HTML
			// entities replaces, in order to prevent them from
			// being interpreted as HTML when we `dangerouslySetInnerHtml`
			// within the code-block component
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
	)
}

export default normalizePlainCode

/**
 * Adds spacing specific to Dev Dot to the react-code-block <pre> MDX component.
 *
 * Note that spacing for the <pre> element should only be added when the <pre>
 * element is isolated. In some cases, such as within <CodeTabs /> or when
 * <CodeBlockConfig /> adds a filename or title to a code block, the <pre>
 * element appears below a bar of content, so margin should not be applied.
 */
export function MdxPre({ children, className, ...restProps }: MdxPreProps) {
	return (
		<CodeBlock
			{...restProps}
			className={classNames(className, {
				[s.codeBlockMargin]: !restProps.hasBarAbove,
			})}
			value={normalizePlainCode(childrenOfFirstChild(children))}
			hasLineNumbers={false}
			hasCopyButton
		/>
	)
}

function childrenOfFirstChild(children: ReactNode): ReactNode {
	const firstElement = Children.toArray(children)[0]
	if (
		firstElement &&
		typeof firstElement === 'object' &&
		'props' in firstElement
	) {
		return firstElement.props.children
	}

	throw new Error('First element of children is not an object with props')
}
