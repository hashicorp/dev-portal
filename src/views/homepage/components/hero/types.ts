/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'

export interface HeroProps {
	className?: string
	heading: string
	description: ReactElement
}
