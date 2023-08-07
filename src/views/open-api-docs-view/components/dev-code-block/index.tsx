/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CSSProperties, ReactNode } from 'react'
import classNames from 'classnames'
import s from './dev-code-block.module.css'

/**
 * A temporary component for prototyping and scaffolding.
 *
 * Context: sometimes it feels useful to have some visual thing on the page that
 * shows what props & data I have access to in a component when prototyping.
 */
export function DevCodeBlock({
	children,
	style,
	wrap = true,
	className,
}: {
	children: ReactNode
	wrap?: boolean
	className?: string
	style?: CSSProperties
}) {
	return (
		<pre
			className={classNames(className, s.pre, { [s.wrap]: wrap })}
			style={style}
		>
			<code>{children}</code>
		</pre>
	)
}
