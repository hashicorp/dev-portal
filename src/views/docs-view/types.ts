/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { ProductSlug } from 'types/products'
import { SidebarSidecarWithTocProps } from 'layouts/sidebar-sidecar-with-toc'

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
	 * Layout props passed to the SidebarSidecar layout.
	 */
	layoutProps: SidebarSidecarWithTocProps
}

export type ProductsToPrimitivesMap = Record<
	ProductSlug,
	Record<string, ReactNode>
>
