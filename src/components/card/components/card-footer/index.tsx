/**
 * Copyright IBM Corp. 2021, 2025
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
