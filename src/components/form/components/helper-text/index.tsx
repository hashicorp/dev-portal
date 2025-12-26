/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { HelperTextProps } from './types'
import s from './helper-text.module.css'

const HelperText = ({ children, className, id }: HelperTextProps) => {
	const classes = classNames(s.root, className)

	return (
		<span className={classes} id={id}>
			{children}
		</span>
	)
}

export type { HelperTextProps }
export default HelperText
