/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { ProgramSlug } from 'views/certifications/types'

export interface ProgramHeroProps {
	heading: string
	description: string
	slug: ProgramSlug
}

export interface HeroProps {
	heading: string
	description: string
	backgroundSlot?: ReactNode
	imageSlot?: ReactNode
	foreground?: 'dark' | 'light'
}
