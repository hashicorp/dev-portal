/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ReactNode } from 'react'

export interface TruncateMaxLinesProps {
	children: ReactNode
	className?: string
	maxLines: number
}
