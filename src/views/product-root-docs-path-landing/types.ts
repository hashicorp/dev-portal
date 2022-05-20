import { ReactElement } from 'react'
import { ProductData } from 'types/products'

interface PageContent {
  pageSubtitle: string
  // TODO create a block type
  marketingContentBlocks: any[]
}

interface GenerateGetStaticPropsArguments {
  baseName: string
  basePath: string
  pageContent: PageContent
  product: ProductData
}
interface ProductRootDocsPathLandingProps {
  mdxSlot?: ReactElement
  pageContent: PageContent
  pageHeading: {
    id: string
    level: 1
    slug: string
    title: string
  }
}

export type { GenerateGetStaticPropsArguments, ProductRootDocsPathLandingProps }
