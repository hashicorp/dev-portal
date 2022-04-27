import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductCollectionsSidebar, {
  ProductCollectionsSidebarProps,
} from 'components/tutorials-sidebar/compositions/product-collections-sidebar'
import { ProductTutorialsSitemap } from './components'
import { ProductTutorialsViewProps } from './server'
import ProductViewContent from './components/product-view-content'
import {
  getOverviewHeading,
  getSitemapHeading,
} from './helpers/heading-helpers'

function ProductTutorialsView({
  layoutProps,
  data,
  product,
}: ProductTutorialsViewProps): React.ReactElement {
  const { inlineCollections, inlineTutorials, pageData, allCollections } = data
  const { showProductSitemap, blocks } = pageData
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
