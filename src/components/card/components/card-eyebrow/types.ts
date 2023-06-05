/**
 * Copyright (c) HashiCorp, Inc.
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
