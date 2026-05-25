/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

export interface BrandedHeaderCardProps {
	heading: string
	description?: string
	productSlug?: ProductSlug
}
