import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductCollectionsSidebar, {
  ProductCollectionsSidebarProps,
} from 'components/tutorials-sidebar/compositions/product-collections-sidebar'
import { ProductTutorialsSitemap } from './components'
import { ProductTutorialsPageProps } from './server'
import ProductViewContent from './components/product-view-content'
import {
  getOverviewHeading,
  getSitemapHeading,
} from './helpers/heading-helpers'
import { JSXElementConstructor } from 'react'

function ProductTutorialsView({
  layoutProps,
  data,
  product,
}: ProductTutorialsPageProps): React.ReactElement {
  const { inlineCollections, inlineTutorials, pageData } = data
  const { showProductSitemap, blocks, allCollections } = pageData
  const sidebarProduct = {
    name: product.name,
    slug: product.slug,
  } as ProductCollectionsSidebarProps['product']

  const PageHeading = () => {
    const { title, level, slug } = getOverviewHeading(product.name)
    const HeadingElem = `h${level}` as React.ElementType
    return <HeadingElem id={slug}>{title}</HeadingElem>
  }

  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      headings={layoutProps.headings}
      sidebarSlot={
        <ProductCollectionsSidebar
          isOverview={true}
          product={sidebarProduct}
          sections={layoutProps.sidebarSections}
        />
      }
    >
      <PageHeading />
      <ProductViewContent
        blocks={blocks}
        inlineCollections={inlineCollections}
        inlineTutorials={inlineTutorials}
      />
      {showProductSitemap
        ? (() => {
            const { title, level, slug } = getSitemapHeading()
            const HeadingElem = `h${level}` as React.ElementType
            return (
              <>
                <HeadingElem id={slug}>{title}</HeadingElem>
                <ProductTutorialsSitemap collections={allCollections} />
              </>
            )
          })()
        : null}
    </SidebarSidecarLayout>
  )
}

ProductTutorialsView.layout = CoreDevDotLayout
export default ProductTutorialsView
