/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	IconCardGridItem,
	ProductRootDocsPathLandingProps,
} from 'views/product-root-docs-path-landing/types'

export interface ProductRootDocsPathLandingHeroProps {
	pageHeading: ProductRootDocsPathLandingProps['pageHeading']
	pageSubtitle: string
	iconCardGridItems?: IconCardGridItem[]
	versions: $TSFixMe
	projectName?: string
}
