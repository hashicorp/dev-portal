/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ThemedImageProps } from 'views/product-landing/components/themed-image'

export interface OverviewCtaProps {
	heading: string
	headingSlug: string
	body: string
	image?: ThemedImageProps['src']
	cta?: {
		text: string
		url: string
	}
}
