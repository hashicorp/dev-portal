/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { CommandBarDividerProps } from './types'
import s from './command-bar-divider.module.css'

const CommandBarDivider = ({ className }: CommandBarDividerProps) => {
	return <hr className={classNames(s.root, className)} />
}

export type { CommandBarDividerProps }
export { CommandBarDivider }
