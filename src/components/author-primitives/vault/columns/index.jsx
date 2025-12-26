/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'

export default function Columns({ count = 1, children }) {
	return <div className={`${s.root} ${s['count-' + count]}`}>{children}</div>
}
