import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductCollectionsSidebar, {
  ProductCollectionsSidebarProps,
} from 'components/tutorials-sidebar/compositions/product-collections-sidebar'
import { ProductTutorialsSitemap } from './components'
import { ProductTutorialsPageProps } from './server'
import ProductViewContent from './components/product-view-content'

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
      <h1 id={layoutProps.headings[0].slug}>{product.name} Tutorials</h1>
      <ProductViewContent
        blocks={blocks}
        inlineCollections={inlineCollections}
        inlineTutorials={inlineTutorials}
      />
      {showProductSitemap ? (
        <>
          <h2 id={layoutProps.headings[layoutProps.headings.length - 1].slug}>
            All tutorials
          </h2>
          <ProductTutorialsSitemap collections={allCollections} />
        </>
      ) : null}
    </SidebarSidecarLayout>
  )
}

ProductTutorialsView.layout = CoreDevDotLayout
export default ProductTutorialsView
