import { ReactElement } from 'react'
import classNames from 'classnames'
import DocsView from 'views/docs-view'
import ProductDocsSearch from 'views/docs-view/components/product-docs-search'
import { ProductRootDocsPathLandingProps } from './types'
import {
  ProductRootDocsPathLandingHero,
  ProductRootDocsPathLandingMarketingContent,
} from './components'
import s from './product-root-docs-path-landing.module.css'
import DocsViewLayout from 'layouts/docs-view-layout'

const ProductRootDocsPathLanding = ({
  mdxSource,
  pageContent,
  pageHeading,
  product,
}: ProductRootDocsPathLandingProps) => {
  const { pageSubtitle, marketingContentBlocks } = pageContent
  const showProductDocsSearch = __config.flags.enable_product_docs_search

  let mdxSlot: ReactElement
  /**
   * TODO: cloud.hashicorp.com/docs redirects to cloud.hashicorp.com/docs/hcp,
   * and the content for the former URL is empty (just a heading).
   * This is a workaround to prevent the empty content from being rendered.
   * https://github.com/hashicorp/cloud.hashicorp.com/blob/main/content/docs/index.mdx
   */
  const isNotHcpDocs = product.slug != 'hcp'
  if (mdxSource && isNotHcpDocs) {
    const classes = classNames(s[`${product.slug}MDXWrapper`], s.mdxSlotWrapper)
    mdxSlot = (
      <div className={classes}>
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
      <ProductRootDocsPathLandingMarketingContent
        blocks={marketingContentBlocks}
      />
      {mdxSlot}
    </>
  )
}

ProductRootDocsPathLanding.layout = DocsViewLayout
export type { ProductRootDocsPathLandingProps }
export default ProductRootDocsPathLanding
