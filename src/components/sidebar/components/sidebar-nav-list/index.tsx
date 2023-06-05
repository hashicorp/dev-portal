/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import s from '../../sidebar.module.css'

export default function SidebarNavList({ children }: { children: ReactNode }) {
	return <ul className={s.navList}>{children}</ul>
}
