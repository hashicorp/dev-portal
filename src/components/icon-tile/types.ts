/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

export type ProductBrandColor =
	| 'neutral'
	| 'neutral-dark'
	| Exclude<ProductSlug, 'sentinel' | 'hcp'>

export interface IconTileProps {
	/** Pass a single child, which should be a Flight icon. For 'small' and 'medium' size, pass the 16px icon size; for other sizes pass the 24px icon size. Note that non-"color" icons will be colored using the "brandColor". */
	children: React.ReactNode
	/** Note: the "extra-large" option is not documented in the design system. It's being used for the IconTileLogo component, as used on the /{product} view pages. */
	size?: 'small' | 'medium' | 'large' | 'extra-large'
	/** Optional product slug to use for brand color theming. If not provided, defaults to "neutral". Note that "sentinel" and "hcp" are not supported. */
	brandColor?: ProductBrandColor
	className?: string
}
