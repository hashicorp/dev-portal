/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { ProductSlug, ProductWithCurrentRootDocsPath } from 'types/products'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { OutlineLinkItem } from 'components/outline-nav/types'

export interface DocsViewProps {
	/**
	 * Frontmatter parsed from the MDX document
	 */
	metadata?: Record<string, any>

	/**
	 * Represents the return value of a call to `serialize()`. The properties
	 * from this object that are passed unchanged to `MDXRemote` are
	 * `compiledSource` and `scope`.
	 */
	mdxSource: MDXRemoteSerializeResult

	/**
	 * Identical to the `MDXRemoteProps['lazy']` prop. The value is passed
	 * unchanged to `MDXRemote`.
	 */
	lazy?: boolean

	versions?: VersionSelectItem[]

	/**
	 * An optional, human-readable name to be rendered where the section is referenced as a versioned project
	 */
	projectName?: string

	/**
	 * Product data. Note this is not used directly by `DocsView`. Instead,
	 * it's routed through `_app.tsx` to set up our CurrentProductProvider.
	 */
	product: ProductWithCurrentRootDocsPath

	/**
	 * Layout props passed to the SidebarSidecar layout.
	 */
	layoutProps: Omit<SidebarSidecarLayoutProps, 'children'>

	/**
	 * Outline items, for the OutlineNav we display in the sidecar.
	 */
	outlineItems: OutlineLinkItem[]
}

export type ProductsToPrimitivesMap = Record<
	ProductSlug,
	Record<string, ReactNode>
>
