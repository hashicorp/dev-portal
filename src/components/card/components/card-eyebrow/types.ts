/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'

interface CardEyebrowProps {
	children: ReactNode
	className?: string
}

interface CardEyebrowTextProps {
	children: string
}

export type { CardEyebrowProps, CardEyebrowTextProps }
