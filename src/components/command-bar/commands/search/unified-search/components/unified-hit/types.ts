/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ProductSlug } from 'types/products'
import type { Hit } from 'instantsearch.js'
import type { UnifiedSearchableContentType } from '../../types'

export interface UnifiedHitProps {
	type: Exclude<UnifiedSearchableContentType, 'global'>
	href: string
	ariaLabel: string
	titleHtml: string
	descriptionHtml: string
	productSlug: ProductSlug
	productName: string
	hit: Hit
}
