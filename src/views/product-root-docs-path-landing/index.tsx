import { ReactElement } from 'react'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import ProductDocsSearch from 'views/docs-view/components/product-docs-search'
import { ProductRootDocsPathLandingProps } from './types'
import {
  ProductRootDocsPathLandingHero,
  ProductRootDocsPathLandingMarketingContent,
} from './components'
import s from './product-root-docs-path-landing.module.css'

const ProductRootDocsPathLanding = ({
  mdxSource,
  pageContent,
  pageHeading,
  product,
}: ProductRootDocsPathLandingProps) => {
  const { pageSubtitle, marketingContentBlocks } = pageContent
  const showProductDocsSearch = __config.flags.enable_product_docs_search

  let mdxSlot: ReactElement
  if (mdxSource) {
    mdxSlot = (
      <div className={s[`${product.slug}MDXWrapper`]}>
        <DocsView mdxSource={mdxSource} hideSearch />
      </div>
    )
  }

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

ProductRootDocsPathLanding.layout = SidebarSidecarLayout
export type { ProductRootDocsPathLandingProps }
export default ProductRootDocsPathLanding
