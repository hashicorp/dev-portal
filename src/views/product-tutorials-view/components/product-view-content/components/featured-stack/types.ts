/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'

export interface FeaturedStackProps {
	heading: string
	/**
	 * Identifier for the heading, which should unique in the context of the page
	 * Note: headingSlug is added after fetching content from the Learn API
	 */
	headingSlug: string
	/** An optional subheading. Supports HTML. */
	subheading?: string
	children: ReactNode
}
