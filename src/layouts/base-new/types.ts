/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { Products as HashiCorpProduct } from '@hashicorp/platform-product-meta'

interface BaseNewLayoutProps {
	/**
	 * Content to render within the layout.
	 */
	children: ReactNode

	/**
	 * Defaults to false. If true, a border will be shown to separate
	 * the footer from the page contents above.
	 */
	showFooterTopBorder?: boolean
}

interface AlertBannerProps {
	tag: string
	url: string
	text: string
	linkText: string
	product?: HashiCorpProduct
	expirationDate?: string
}

export type { BaseNewLayoutProps, AlertBannerProps }
