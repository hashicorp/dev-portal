/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { ReactNode } from 'react'
import s from './card-eyebrow.module.css'

function CardEyebrow({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return <span className={classNames(s.eyebrow, className)}>{children}</span>
}

export { CardEyebrow }
