import { ReactNode } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductSlug } from 'types/products'

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
}

export type ProductsToPrimitivesMap = Record<
	ProductSlug,
	Record<string, ReactNode>
>
