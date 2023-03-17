/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './mdx-table.module.css'

/**
 * Lightweight wrapper around the native <table> element. Encapsulates styles,
 * enables scrolling when tables are too tall or wide, and uses `tabindex="0"`
 * to enable keyboard-only users to access the overflowed content.
 */
export function MdxTable(props: JSX.IntrinsicElements['table']) {
	return (
		<div className={s.root}>
			<div className={s.tableWrapper} tabIndex={0}>
				<table {...props} />
			</div>
			<div className={s.tableFocusRing} />
		</div>
	)
}
