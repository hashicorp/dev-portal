import { ProductOption } from 'lib/learn-client/types'
import { useCurrentProduct } from 'contexts'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import {
  generateProductLandingSidebarNavData,
  generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import TutorialsSidebar, {
  TutorialsSidebarContent,
} from 'components/tutorials-sidebar'
import { ProductTutorialsSitemap } from './components'
import { ProductTutorialsViewProps } from './server'
import ProductViewContent from './components/product-view-content'
import { getOverviewHeading } from './helpers/heading-helpers'
import s from './product-tutorials-view.module.css'

function ProductTutorialsView({
  layoutProps,
  data,
}: ProductTutorialsViewProps): React.ReactElement {
  const currentProduct = useCurrentProduct()
  const { inlineCollections, inlineTutorials, pageData, allCollections } = data
  const { showProductSitemap, blocks } = pageData

  const sidebarNavDataLevels = [
    generateTopLevelSidebarNavData(currentProduct.name),
    generateProductLandingSidebarNavData(currentProduct),
    {
      levelButtonProps: {
        levelUpButtonText: `${currentProduct.name} Home`,
        levelDownButtonText: 'Previous',
      },
      backToLinkProps: {
        text: `${currentProduct.name} Home`,
        href: `/${currentProduct.slug}`,
      },
      title: 'Tutorials',
      children: (
        <TutorialsSidebarContent sections={layoutProps.sidebarSections} />
      ),
    },
  ]

  const PageHeading = () => {
    const { title, level, slug } = getOverviewHeading()
    const HeadingElem = `h${level}` as React.ElementType
    return (
      <HeadingElem id={slug} className={s.heading}>
        {title}
      </HeadingElem>
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
            product={currentProduct.slug as ProductOption}
          />
        </div>
      ) : null}
    </SidebarSidecarLayout>
  )
}

ProductTutorialsView.layout = CoreDevDotLayout
export default ProductTutorialsView
