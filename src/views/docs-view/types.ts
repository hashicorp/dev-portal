/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
import { VersionSelectItem } from './loaders/remote-content'
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

	/**
	 * Page heading, renders the `<h1 />` for the page outside the MDX area.
	 *
	 * Optional. If provided, the MDX area should have its `<h1 />` removed
	 * using `remarkPluginRemoveH1`. The one case where we do _not_ use
	 * `pageHeading` is in Packer plugins. That use case is expected to be
	 * deprecated soon, so we may be able to make this a required property
	 * in the near future.
	 */
	pageHeading?: {
		id: string
		title: string
	}
}

export type ProductsToPrimitivesMap = Record<
	ProductSlug,
	Record<string, ReactNode>
>
