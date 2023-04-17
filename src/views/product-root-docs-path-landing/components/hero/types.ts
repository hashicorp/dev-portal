/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
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
