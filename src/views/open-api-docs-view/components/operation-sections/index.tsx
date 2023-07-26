/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import s from './operation-sections.module.css'

/**
 * Lays out columns for the examples and details of an operation.
 *
 * On large viewports, the exampleSlot is sticky and scrolls alongside
 * the detailsSlot. On smaller viewports, the examplesSlot stacks above
 * the detailsSlot. On the smallest viewports, it may be hidden entirely.
 *
 * TODO: determine breakpoint at which to hide examplesSlot, and implement.
 */
export function OperationSections({
	examplesSlot,
	detailsSlot,
}: {
	examplesSlot: ReactNode
	detailsSlot: ReactNode
}) {
	return (
		<div className={s.root}>
			<div className={s.examplesSlot}>{examplesSlot}</div>
			<div className={s.detailsSlot}>{detailsSlot}</div>
		</div>
	)
}
