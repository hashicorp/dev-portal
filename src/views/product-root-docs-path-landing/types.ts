import { ReactElement } from 'react'
import { ProductData } from 'types/products'

interface GenerateGetStaticPropsArguments {
  baseName: string
  basePath: string
  product: ProductData
}
interface ProductRootDocsPathLandingProps {
  mdxSlot?: ReactElement
  pageContent: {
    pageSubtitle: string
    // TODO create a block type
    marketingContentBlocks: any[]
  }
}

export type { GenerateGetStaticPropsArguments, ProductRootDocsPathLandingProps }
