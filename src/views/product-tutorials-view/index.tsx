import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Heading from 'components/heading'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import {
  generateProductLandingSidebarNavData,
  generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import TutorialsSidebar, {
  CollectionViewSidebarContent,
} from 'components/tutorials-sidebar'
import { ProductTutorialsSitemap } from './components'
import { ProductTutorialsViewProps } from './server'
import ProductViewContent from './components/product-view-content'
import { getOverviewHeading } from './helpers/heading-helpers'
import s from './product-tutorials-view.module.css'

function ProductTutorialsView({
  data,
  layoutProps,
  product,
}: ProductTutorialsViewProps): React.ReactElement {
  const { inlineCollections, inlineTutorials, pageData, allCollections } = data
  const { showProductSitemap, blocks } = pageData

  const sidebarNavDataLevels = [
    generateTopLevelSidebarNavData(product.name),
    generateProductLandingSidebarNavData(product),
    {
      levelButtonProps: {
        levelUpButtonText: `${product.name} Home`,
        levelDownButtonText: 'Previous',
      },
      backToLinkProps: {
        text: `${product.name} Home`,
        href: `/${product.slug}`,
      },
      overviewItemHref: `/${product.slug}/tutorials`,
      title: 'Tutorials',
      children: (
        <CollectionViewSidebarContent sections={layoutProps.sidebarSections} />
      ),
    },
  ]

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
      AlternateSidebar={TutorialsSidebar}
      sidebarNavDataLevels={sidebarNavDataLevels as any[]}
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
