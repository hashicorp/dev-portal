/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import type { VersionSelectItem } from 'views/docs-view/loaders/remote-content'
import {
	IconCardGridItem,
	ProductRootDocsPathLandingProps,
} from 'views/product-root-docs-path-landing/types'

export interface ProductRootDocsPathLandingHeroProps {
	pageHeading: ProductRootDocsPathLandingProps['pageHeading']
	pageSubtitle: string
	iconCardGridItems?: IconCardGridItem[]
	versions?: VersionSelectItem[]
	projectName?: string
}
