import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'

interface PageContent {
	pageSubtitle: string
	// TODO create a block type
	marketingContentBlocks: $TSFixMe[]
}

interface GenerateGetStaticPropsArguments {
	product: ProductData
}

interface ProductRootDocsPathLandingProps {
	/**
	 * TODO: see note in ./server.ts, we likely want to avoid passing this
	 * to the client, but for now, needed to prevent client-side error due
	 * to some apparent quirks in NextJS routing.
	 */
	includeMdxSource?: boolean
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
