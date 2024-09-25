/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { TruncateMaxLinesProps } from './types'
import s from './truncate-max-lines.module.css'

function TruncateMaxLines({
	children,
	className,
	maxLines,
}: TruncateMaxLinesProps) {
	return (
		<span
			className={classNames(s.root, className)}
			style={
				{
					'--max-lines': maxLines,
				} as React.CSSProperties
			}
		>
			{children}
		</span>
	)
}

export default TruncateMaxLines
