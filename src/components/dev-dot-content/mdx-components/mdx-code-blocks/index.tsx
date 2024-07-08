/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Children } from 'react'
import classNames from 'classnames'
import CodeBlock from '@hashicorp/react-design-system-components/src/components/code-block'
import Tabs, { Tab } from 'components/tabs'
import Text from 'components/text'
import { getLanguageName } from './utils'
import type { PropsWithChildren, ReactNode } from 'react'
import s from './mdx-code-blocks.module.css'

interface CodeBlockConfigProps {
	/**
	 * A className string which will be added to the outer element of
	 * this component.
	 * */
	className?: string

	/**
	 * The code to be displayed in the code block as an output of Shiki.
	 */
	children?: ReactNode

	/**
	 * Set to `true` to remove border rounding.
	 */
	hasBarAbove?: boolean

	/**
	 * The heading to be displayed above the code block. Used if `filename` is
	 * not provided.
	 */
	heading?: string

	/**
	 * The filename to be displayed above the code block. Will override `heading`
	 * if both are provided.
	 */
	filename?: string

	/**
	 * Accepts a list or range of line numbers to highlight. (Examples: `2, 4`,
	 * `6-10`)
	 */
	highlight?: string

	/**
	 * Used to control display of line numbers. Defaults to `true`.
	 */
	lineNumbers?: boolean

	/**
	 * Used to control whether a copy button for copying the code/text content
	 * will be displayed. Defaults to `false`.
	 */
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
	// This is only used for debugging purposes as we use shiki to assign the language tokens and styles
	const propsOfFirstChild = getFirstChildProps(children)

	return (
		<CodeBlock
			className={className}
			language={propsOfFirstChild?.language as string}
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
 * Re-exports <CodeBlockConfig />, for naming consistency.
 */
export const MdxCodeBlockConfig = CodeBlockConfig

export function MdxCodeTabs({
	children,
	heading,
	tabs,
}: {
	children: ReactNode
	heading?: string
	tabs?: string[]
}) {
	// `children` is a ReactNode containing multiple code blocks, either as
	// raw <pre> elements or as <CodeBlockConfig> components. Since we need to
	// iterate over these children to extract the language of each code block,
	// we first convert the ReactNode to an array of elements.
	const childCodeBlocks = Children.toArray(children)

	return (
		<div>
			{heading && (
				<Text weight="medium" className={s.codeBlockMargin}>
					{heading}
				</Text>
			)}
			<Tabs>
				{childCodeBlocks.map((child, index) => {
					// If the child is not an object with props, it's not a
					// code block, so we can skip over it. This also narrows the
					// type for `child`.
					if (!(typeof child === 'object' && 'props' in child)) return null

					// If the child comes from MDX, it will have an `mdxType` prop.
					// We can check the value of this prop to determine if it's
					// safe to expect the single child to have the language class
					// as a prop.
					const { mdxType, ...restprops } = child.props
					const isCodeBlock = ['pre', 'CodeBlockConfig'].includes(mdxType)

					// If the child is an MDX code block, we can extract the language
					// class from the child's props. Otherwise, we rely on the
					// child having a language prop.
					const languageClass = isCodeBlock
						? restprops.children.props.className
						: `language-${restprops.language}`
					const slugFromClass = languageClass.split('-')[1]

					// Tabs require a heading prop, which can be statically defined
					// or dynamically generated from the language class of the code
					// block. If tabs are provided, we use the tab at the current
					// index as the heading. Otherwise, we attempt to generate a
					// heading from the language class. Finally, we fallback to the
					// language class if no heading can be generated.
					const heading = tabs
						? tabs[index]
						: getLanguageName(slugFromClass) ?? slugFromClass

					return (
						<Tab key={slugFromClass} heading={heading} group={slugFromClass}>
							{child}
						</Tab>
					)
				})}
			</Tabs>
		</div>
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
			value={normalizePlainCode(childrenOfFirstChild(children) || children)}
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
	} else {
		return null
	}
}

function getFirstChildProps(
	children: ReactNode
): Record<string, unknown> | null {
	const firstElement = Children.toArray(children)[0]
	if (
		firstElement &&
		typeof firstElement === 'object' &&
		'props' in firstElement
	) {
		return firstElement.props
	} else {
		return null
	}
}
