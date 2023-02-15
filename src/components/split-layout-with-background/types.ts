/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'

export interface SplitLayoutWithBackgroundProps {
	/**
	 * Optional class to add to the root element. Intended for vertical padding.
	 */
	paddingClass?: string
	/**
	 * Optional background class. Intended for adding a background behind
	 * the split layout.
	 */
	backgroundClass?: string
	/**
	 * Contents to render in the start slot of the split layout.
	 */
	startSlot: ReactNode
	/**
	 * Contents to render in the end slot of the split layout.
	 */
	endSlot: ReactNode
}
