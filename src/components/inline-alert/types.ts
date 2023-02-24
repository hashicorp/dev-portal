/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactChild } from 'react'

export interface InlineAlertProps {
	className?: string
	color?: 'neutral' | 'highlight' | 'warning' | 'critical'
	description: ReactChild | ReactChild[]
	icon?: JSX.IntrinsicElements['svg']
	title: string
}
