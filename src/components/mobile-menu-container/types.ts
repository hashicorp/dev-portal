/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'

type NativeDivElement = JSX.IntrinsicElements['div']

interface MobileMenuContainerProps {
	children: ReactNode
	className?: NativeDivElement['className']
}

export type { MobileMenuContainerProps }
