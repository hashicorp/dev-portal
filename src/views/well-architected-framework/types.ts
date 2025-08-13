/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionSelectItem } from '../docs-view/loaders/remote-content'
import { OutlineLinkItem } from 'components/outline-nav/types'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
import {
	ProductData,
	ProductWithCurrentRootDocsPath,
	RootDocsPath,
} from 'types/products'


import { EnrichedNavItem } from 'components/sidebar/types'
import { HeroHeadingVisualProps } from 'views/product-landing/components/hero-heading-visual/types'
import { OverviewCtaProps } from 'views/product-landing/components/overview-cta/types'
import { ProductViewBlock } from 'views/product-tutorials-view/components/product-view-content'
import { HeadMetadataProps } from 'components/head-metadata/types'

interface PageContent {
	pageSubtitle: string
	// TODO create a block type
	marketingContentBlocks: $TSFixMe[]
	iconCardGridItems?: IconCardGridItem[]
	hero?: HeroHeadingVisualProps
	overview?: OverviewCtaProps
}

type IconCardGridItem = Pick<RootDocsPath, 'iconName' | 'name' | 'path'>

interface GenerateGetStaticPropsArguments {
	product: ProductData
}

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

export interface WellArchitectedFrameworkLandingProps {
	metadata: HeadMetadataProps & {
		name: string
		slug: string
	}
	outlineItems: OutlineLinkItem[]
	data?: {
		pageData?: {
			blocks?: ProductViewBlock[]
		}
		wafContent?: {
			hero?: HeroHeadingVisualProps
			overview?: OverviewCtaProps
		}
	}
	layoutProps: {
		breadcrumbLinks: SidebarSidecarLayoutProps['breadcrumbLinks']
		sidebarSections: EnrichedNavItem[]
	}
}

export type {
	GenerateGetStaticPropsArguments,
	ProductRootDocsPathLandingProps,
	IconCardGridItem,
}
