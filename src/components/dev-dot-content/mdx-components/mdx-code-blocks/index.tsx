/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'
import { CodeTabsProps } from '@hashicorp/react-code-block/partials/code-tabs'
import classNames from 'classnames'
import { PropsWithChildren } from 'react'
import s from './mdx-code-blocks.module.css'

/**
 * In all MDX contexts in Dev Dot, we want our
 * MDX code block primitives to have a dark theme.
 */
const {
	CodeBlockConfig,
	CodeTabs,
	pre: ReactPre,
} = codeBlockPrimitives({
	theme: 'dark',
})

/**
 * Re-exports react-code-block <CodeBlockConfig />, for naming consistency.
 */
export const MdxCodeBlockConfig = CodeBlockConfig

/**
 * Adds spacing specific to Dev Dot to react-code-block <CodeTabs/>.
 */
export function MdxCodeTabs({ className, ...restProps }: CodeTabsProps) {
	return (
		<CodeTabs
			{...restProps}
			className={classNames(className, s.codeTabsMargin)}
		/>
	)
}

interface MdxPreProps extends PropsWithChildren {
	className?: string
	hasBarAbove?: boolean
	theme?: 'light' | 'dark'
}

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
		<ReactPre
			{...restProps}
			className={classNames(className, {
				[s.codeBlockMargin]: !restProps.hasBarAbove,
			})}
			// NOTE: this ts-expect-error can be removed once @hashicorp/react-code-block'
			// PreProps.children type is replaced with React 18's `extends PropsWithChildren`.
			// The children prop can also be moved away from the disallowed `children` prop.
			//
			// @ts-expect-error - see note
			// eslint-disable-next-line react/no-children-prop
			children={children}
		/>
	)
}
