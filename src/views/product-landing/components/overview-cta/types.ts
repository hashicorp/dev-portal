/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ThemedImageProps } from 'components/themed-image/types'

export interface OverviewCtaProps {
	heading: string
	headingSlug: string
	body: string
	image: ThemedImageProps['src']
	cta?: {
		text: string
		url: string
	}
}
