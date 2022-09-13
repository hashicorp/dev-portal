import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData, RootDocsPath } from 'types/products'

interface PageContent {
	pageSubtitle: string
	// TODO create a block type
	marketingContentBlocks: $TSFixMe[]
	iconCardGridItems?: IconCardGridItem[]
}

type IconCardGridItem = Pick<RootDocsPath, 'iconName' | 'name' | 'path'>

interface GenerateGetStaticPropsArguments {
	product: ProductData
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
	versions?: VersionSelectItem[]
}

export type {
	GenerateGetStaticPropsArguments,
	ProductRootDocsPathLandingProps,
	IconCardGridItem,
}
