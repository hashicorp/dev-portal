/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionSelectItem } from '../docs-view/loaders/remote-content'
import { OutlineLinkItem } from 'components/outline-nav/types'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
import {
	ProductWithCurrentRootDocsPath,
	RootDocsPath,
} from 'types/products'
import { HeroHeadingVisualProps } from 'views/product-landing/components/hero-heading-visual/types'
import { OverviewCtaProps } from 'views/product-landing/components/overview-cta/types'

interface PageContent {
	pageSubtitle?: string
	// TODO create a block type
	marketingContentBlocks: $TSFixMe[]
	iconCardGridItems?: IconCardGridItem[]
	hero?: HeroHeadingVisualProps
	overview?: OverviewCtaProps
}

type IconCardGridItem = Pick<RootDocsPath, 'iconName' | 'name' | 'path'>

interface ProductRootDocsPathLandingProps {
	mdxSource?: MDXRemoteSerializeResult
	pageContent: PageContent
	pageHeading: {
		id: string
		title: string
	}
	product: ProductWithCurrentRootDocsPath
	versions?: VersionSelectItem[]
	layoutProps: Omit<SidebarSidecarLayoutProps, 'children'>
	outlineItems: OutlineLinkItem[]
}

export type { ProductRootDocsPathLandingProps, IconCardGridItem }
