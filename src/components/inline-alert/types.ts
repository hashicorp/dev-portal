/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactNode, type ReactElement } from 'react'

export interface InlineAlertProps {
	className?: string
	ctaSlot?: ReactNode
	color?: 'neutral' | 'highlight' | 'warning' | 'critical'
	description: ReactNode
	icon?: ReactElement<React.JSX.IntrinsicElements['svg']>
	title: string
}
