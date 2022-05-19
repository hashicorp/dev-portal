import { ReactElement } from 'react'

export interface ProductRootDocsPathLandingProps {
  mdxSlot?: ReactElement
  pageContent: {
    pageSubtitle: string
    // TODO create a block type
    marketingContentBlocks: any[]
  }
}
