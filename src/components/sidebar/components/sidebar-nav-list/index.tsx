/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import classNames from 'classnames'
import s from '../../sidebar.module.css'

type NativeDivElement = JSX.IntrinsicElements['div']

export default function SidebarNavList({
	className,
	children,
}: NativeDivElement & { children: ReactNode }) {
	return <ul className={classNames(s.navList, className)}>{children}</ul>
}
