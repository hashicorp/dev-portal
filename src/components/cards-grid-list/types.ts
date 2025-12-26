/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'

interface CardsGridListProps {
	children: ReactNode
	isOrdered?: boolean
	fixedColumns?: number
	gridGap?: '8px' | '12px' | '16px' | '24px'
	className?: string
}

export type { CardsGridListProps }
