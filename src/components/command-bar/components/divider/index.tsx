/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import s from './command-bar-divider.module.css'

const CommandBarDivider = ({ className }: { className?: string }) => {
	return <hr className={classNames(s.root, className)} />
}
export { CommandBarDivider }
