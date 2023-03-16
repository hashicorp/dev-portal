/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface OverviewCtaProps {
	heading: string
	headingSlug: string
	body: string
	image: string
	themedImage?: {
		light: string
		dark: string
	}
	cta?: {
		text: string
		url: string
	}
}
