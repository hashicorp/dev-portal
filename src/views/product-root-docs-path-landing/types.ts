import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'

interface PageContent {
	pageSubtitle: string
	// TODO create a block type
	marketingContentBlocks: $TSFixMe[]
}

interface GenerateGetStaticPropsOptions {
	includeMDXSource?: boolean
	/**
	 * Optional product slug for our content API.
	 * For some products, this differs from the product slug used on the client.
	 * For example, "hcp" is "cloud.hashicorp.com" in the content API.
	 */
	productSlugForLoader?: string
}

interface ProductRootDocsPathLandingProps {
	mdxSource?: MDXRemoteSerializeResult
	pageContent: PageContent
	pageHeading: {
		id: string
		level: 1
		slug: string
		title: string
	}
	product: ProductData
}

export type { GenerateGetStaticPropsOptions, ProductRootDocsPathLandingProps }
