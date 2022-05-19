import ProductDocsSearch from 'views/docs-view/components/product-docs-search'
import { ProductRootDocsPathLandingProps } from './types'
import {
  ProductRootDocsPathLandingHero,
  ProductRootDocsPathLandingMarketingContent,
} from './components'

const ProductRootDocsPathLanding = ({
  mdxSlot,
  pageContent,
}: ProductRootDocsPathLandingProps) => {
  const { pageSubtitle, marketingContentBlocks } = pageContent
  const showProductDocsSearch = __config.flags.enable_product_docs_search

  return (
    <>
      {showProductDocsSearch && <ProductDocsSearch />}
      <ProductRootDocsPathLandingHero pageSubtitle={pageSubtitle} />
      {mdxSlot}
      <ProductRootDocsPathLandingMarketingContent
        blocks={marketingContentBlocks}
      />
    </>
  )
}

export type { ProductRootDocsPathLandingProps }
export default ProductRootDocsPathLanding
