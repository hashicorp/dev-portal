/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import classNames from 'classnames'
import s from './cta-group.module.css'

/**
 * Layout component for a group of CTA buttons and links.
 */
export function CtaGroup({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return <div className={classNames(s.root, className)}>{children}</div>
}
