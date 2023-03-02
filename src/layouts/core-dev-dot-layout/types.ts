/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { GlobalThemeOption } from 'styles/themes/types'

interface CoreDevDotLayoutProps {
	children: ReactNode
	theme?: GlobalThemeOption
}

export type { CoreDevDotLayoutProps }
