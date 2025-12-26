/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'

export default function ChecklistWrapper({ children }) {
	return <div className={s.root}>{children}</div>
}
