/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Children } from 'react'
import s from './merchandising-slots.module.css'

export default function MerchandisingSlots({ children }) {
	const totalSlots = Children.count(children)
	if (![2, 4].includes(totalSlots)) {
		throw new Error(
			`MerchandisingSlots expects 2 or 4 children, but received ${totalSlots}`
		)
	}
	return (
		<section className={s.merchandisingSlots}>
			<div className={s.container}>{children}</div>
		</section>
	)
}
