/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'

export default function InlineTag({ title, color }) {
	return <span className={`${s.root} ${s[color]}`}>{title}</span>
}
