import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'

interface PageContent {
	pageSubtitle: string
	// TODO create a block type
	marketingContentBlocks: $TSFixMe[]
}

interface GenerateGetStaticPropsArguments {
	includeMDXSource?: boolean
	pageContent: PageContent
	product: ProductData
	/**
	 * Determines which MDX content will be loaded for the page.
	 * TODO: this should likely not be optional,
	 * should be explicitly set when calling generateGetStaticProps
	 */
	basePath?: string
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

export type { GenerateGetStaticPropsArguments, ProductRootDocsPathLandingProps }
