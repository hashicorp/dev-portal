/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { ReactNode } from 'react'

export interface BrandedCardProps {
	children: ReactNode
	productSlug?: ProductSlug
}
