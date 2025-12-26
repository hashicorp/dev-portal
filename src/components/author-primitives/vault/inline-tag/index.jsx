/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'

export default function InlineTag({ title, color }) {
	return <span className={`${s.root} ${s[color]}`}>{title}</span>
}
