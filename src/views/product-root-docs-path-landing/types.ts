import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'

interface PageContent {
	pageSubtitle: string
	// TODO create a block type
	marketingContentBlocks: $TSFixMe[]
}

interface GenerateGetStaticPropsArguments {
	product: ProductData

	/**
	 * Determines which basePath will be used for the page.
	 * This affects MDX content, as well as elements such as the breadcrumb bar.
	 */
	basePath: string
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
