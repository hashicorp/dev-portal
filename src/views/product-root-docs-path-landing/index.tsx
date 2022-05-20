import ProductDocsSearch from 'views/docs-view/components/product-docs-search'
import { ProductRootDocsPathLandingProps } from './types'
import {
  ProductRootDocsPathLandingHero,
  ProductRootDocsPathLandingMarketingContent,
} from './components'

const ProductRootDocsPathLanding = ({
  mdxSlot,
  pageContent,
  pageHeading,
}: ProductRootDocsPathLandingProps) => {
  const { pageSubtitle, marketingContentBlocks } = pageContent
  const showProductDocsSearch = __config.flags.enable_product_docs_search

  return (
    <>
      {showProductDocsSearch && <ProductDocsSearch />}
      <ProductRootDocsPathLandingHero
        pageHeading={pageHeading}
        pageSubtitle={pageSubtitle}
      />
      {mdxSlot}
      <ProductRootDocsPathLandingMarketingContent
        blocks={marketingContentBlocks}
      />
    </>
  )
}

export type { ProductRootDocsPathLandingProps }
export default ProductRootDocsPathLanding
