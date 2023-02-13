/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'

export interface CertificationsHeroProps {
	heading: string
	description: string
	backgroundSlot?: ReactNode
	imageSlot?: ReactNode
	foreground?: 'dark' | 'light'
}
