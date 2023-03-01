/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { CardFooterProps } from './types'
import s from './card-footer.module.css'

const CardFooter = ({ children, className }: CardFooterProps) => {
	return <div className={classNames(s.root, className)}>{children}</div>
}

export type { CardFooterProps }
export default CardFooter
