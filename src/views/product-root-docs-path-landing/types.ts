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
