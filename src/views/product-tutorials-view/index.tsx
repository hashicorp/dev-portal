import { Fragment } from 'react'
import slugify from 'slugify'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductCollectionsSidebar, {
  ProductCollectionsSidebarProps,
} from 'components/tutorials-sidebar/compositions/product-collections-sidebar'
import { ProductTutorialsSitemap } from './components'
import { ProductTutorialsPageProps } from './server'

function ProductTutorialsView({
  layoutProps,
  data,
  product,
}: ProductTutorialsPageProps): React.ReactElement {
  const { showProductSitemap, blocks, collections } = data.pageData

  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      headings={layoutProps.headings}
      sidebarSlot={
        <ProductCollectionsSidebar
          isOverview={true}
          product={
            {
              name: product.name,
              slug: product.slug,
            } as ProductCollectionsSidebarProps['product']
          }
          sections={layoutProps.sidebarSections}
        />
      }
    >
      <h1 id={layoutProps.headings[0].slug}>{product.name} Tutorials</h1>
      {blocks.map((b, i) => (
        <Fragment key={`${b.type}-${i}`}>
          <h3 id={slugify(b.heading)}> {b.heading} </h3>
          <p>Block type: {b.type}</p>
        </Fragment>
      ))}
      {showProductSitemap ? (
        <>
          <h2 id={layoutProps.headings[layoutProps.headings.length - 1].slug}>
            All tutorials
          </h2>
          <ProductTutorialsSitemap collections={collections} />
        </>
      ) : null}
    </SidebarSidecarLayout>
  )
}

ProductTutorialsView.layout = CoreDevDotLayout
export default ProductTutorialsView
