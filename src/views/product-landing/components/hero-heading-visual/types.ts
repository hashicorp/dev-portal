/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

export interface HeroHeadingVisualProps {
	heading: string
	image?: string
	productSlug?: ProductSlug
}
