/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import s from './mdx-inline-code.module.css'

export type MdxInlineCodeProps = {
	/** Optionally add a `className` to the `<code />` element. */
	className?: string
	/** Optionally set the code style size to use. Defaults to `200`. */
	size?: 100 | 200
} & JSX.IntrinsicElements['code']

function MdxInlineCode({
	className,
	size = 200,
	...restProps
}: MdxInlineCodeProps) {
	// Required for Dynamic CSS Modules classNames, as bare classNames are global styles
	const classNamesToCSSModuleNameIfExists = (className?.split(' ') || []).map(
		(cls) => (s[cls] ? s[cls] : cls)
	)

	return (
		<code
			{...restProps}
			className={classNames(
				s.inlineCode,
				s[`size-${size}`],
				...classNamesToCSSModuleNameIfExists
			)}
		/>
	)
}

export { MdxInlineCode }
