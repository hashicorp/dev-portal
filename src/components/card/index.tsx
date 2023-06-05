/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import classNames from 'classnames'
import { CardProps } from './types'
import s from './card.module.css'

const Card = ({
	children,
	className,
	elevation = 'mid',
}: CardProps): ReactElement => {
	const classes = classNames(`hds-surface-${elevation}`, s.root, className)

	return <div className={classes}>{children}</div>
}

export type { CardProps }
export default Card
