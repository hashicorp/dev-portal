/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { LegendProps } from './types'
import s from './legend.module.css'

const Legend = ({ children, className }: LegendProps) => {
	const classes = classNames(s.root, className)

	return <legend className={classes}>{children}</legend>
}

export type { LegendProps }
export default Legend
