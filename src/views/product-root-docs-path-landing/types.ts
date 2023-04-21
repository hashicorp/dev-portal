/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionSelectItem } from '../docs-view/loaders/remote-content'
import { OutlineLinkItem } from 'components/outline-nav/types'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import {
	ProductData,
	ProductWithCurrentRootDocsPath,
	RootDocsPath,
} from 'types/products'

interface PageContent {
	pageSubtitle: string
	// TODO create a block type
	marketingContentBlocks: $TSFixMe[]
	iconCardGridItems?: IconCardGridItem[]
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

export type {
	GenerateGetStaticPropsArguments,
	ProductRootDocsPathLandingProps,
	IconCardGridItem,
}
