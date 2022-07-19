import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'

interface PageContent {
	pageSubtitle: string
	// TODO create a block type
	marketingContentBlocks: $TSFixMe[]
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

export type { ProductRootDocsPathLandingProps }
