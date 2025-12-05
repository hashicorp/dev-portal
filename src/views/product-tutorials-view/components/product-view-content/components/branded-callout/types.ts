/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductOption } from 'lib/learn-client/types'

export interface BrandedCalloutProps {
	heading: string
	cta: {
		text: string
		url: string
	}
	subheading?: string
	product?: ProductOption
}
