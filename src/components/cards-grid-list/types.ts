/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'

interface CardsGridListProps {
	children: ReactNode
	isOrdered?: boolean
	fixedColumns?: number
	gridGap?: '8px' | '12px' | '16px' | '24px'
}

export type { CardsGridListProps }
