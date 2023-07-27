/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import classNames from 'classnames'
import Link from 'components/link'
import { InlineLinkProps } from './types'
import s from './inline-link.module.css'

const InlineLink = ({
	children,
	className,
	color = 'primary',
	href,
	textSize = 300,
	textWeight = 'regular',
	...rest
}: InlineLinkProps): ReactElement => {
	const classes = classNames(
		s.root,
		`hds-typography-body-${textSize}`,
		`hds-font-weight-${textWeight}`,
		s[color],
		className
	)

	return (
		<Link {...rest} className={classes} href={href}>
			{children}
		</Link>
	)
}

export type { InlineLinkProps }
export default InlineLink
