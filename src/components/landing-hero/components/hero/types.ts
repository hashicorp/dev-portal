/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */
import { ReactNode } from 'react'

export interface HeroProps {
	heading: string
	description: string
	backgroundSlot?: ReactNode
	imageSlot?: ReactNode
	foreground?: 'dark' | 'light'
}
