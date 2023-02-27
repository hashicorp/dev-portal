/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { ProductData, ProductSlug } from 'types/products'
import { SidebarSidecarWithTocProps } from 'layouts/sidebar-sidecar-with-toc'
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

	/**
	 * Optional boolean that enables hiding the `ProductDocsSearch` component. If
	 * `hideSearch` falsy, then `ProductDocsSearch` is automatically rendered if
	 * the `enable_product_docs_search` feature flag is enabled.
	 */
	hideSearch?: boolean

	versions?: VersionSelectItem[]

	/**
	 * An optional, human-readable name to be rendered where the section is referenced as a versioned project
	 */
	projectName?: string

	/**
	 * Product data.
	 * TODO: better document this prop, it was previously undocumented.
	 */
	product: $TSFixMe

	/**
	 * Layout props passed to the SidebarSidecar layout.
	 */
	layoutProps: Omit<SidebarSidecarWithTocProps, 'children'>

	/**
	 * Outline items, for the OutlineNav we display in the sidecar.
	 * TODO: transition to actually using this prop.
	 */
	outlineItems: OutlineLinkItem[]
}

export type ProductsToPrimitivesMap = Record<
	ProductSlug,
	Record<string, ReactNode>
>
