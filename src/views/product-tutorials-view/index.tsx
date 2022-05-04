import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Heading from 'components/heading'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductCollectionsSidebar, {
  ProductCollectionsSidebarProps,
} from 'components/tutorials-sidebar/compositions/product-collections-sidebar'
import { ProductTutorialsSitemap } from './components'
import { ProductTutorialsViewProps } from './server'
import ProductViewContent from './components/product-view-content'
import { getOverviewHeading } from './helpers/heading-helpers'
import s from './product-tutorials-view.module.css'

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
    const { title, level, slug } = getOverviewHeading()
    return (
      <Heading
        id={slug}
        level={level}
        size={500}
        weight="bold"
        className={s.heading}
      >
        {title}
      </Heading>
    )
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
      {showProductSitemap ? (
        <div className={s.sitemap}>
          <ProductTutorialsSitemap
            collections={allCollections}
            product={product.slug}
          />
        </div>
      ) : null}
    </SidebarSidecarLayout>
  )
}

ProductTutorialsView.layout = CoreDevDotLayout
export default ProductTutorialsView
