/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'

export interface CardProps {
	children: ReactNode
	className?: string
	elevation?: 'base' | 'low' | 'mid' | 'high'
}
