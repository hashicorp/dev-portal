import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct } from 'contexts'
import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import {
  generateProductLandingSidebarNavData,
  generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import TutorialsSidebar, {
  HorizontalRule,
  SectionList,
  SectionTitle,
} from 'components/tutorials-sidebar'
import { ProductTutorialsSitemap } from './components'
import { ProductTutorialsViewProps } from './server'
import ProductViewContent from './components/product-view-content'
import { getOverviewHeading } from './helpers/heading-helpers'
import s from './product-tutorials-view.module.css'
import { ProductOption } from 'lib/learn-client/types'

function ProductTutorialsView({
  layoutProps,
  data,
}: ProductTutorialsViewProps): React.ReactElement {
  const currentProduct = useCurrentProduct()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const { inlineCollections, inlineTutorials, pageData, allCollections } = data
  const { showProductSitemap, blocks } = pageData

  // TODO: refactor, very long
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
      children: [
        <>
          <SectionList
            items={[
              {
                text: 'Overview',
                href: `/${currentProduct.slug}/tutorials`,
                isActive: currentPath === `/${currentProduct.slug}/tutorials`,
              },
            ]}
          />
          {layoutProps.sidebarSections.map(
            (section: CollectionCategorySidebarSection) => {
              return (
                <>
                  <HorizontalRule />
                  <SectionTitle text={section.title} />
                  <SectionList items={section.items} />
                </>
              )
            }
          )}
          <HorizontalRule />
          <SectionTitle text="Resources" />
          <SectionList
            items={[
              {
                text: 'All Tutorials',
                href: 'https://learn.hashicorp.com',
              },
              {
                text: 'Community Forum',
                href: 'https://discuss.hashicorp.com',
              },
              { text: 'Support', href: 'https://support.hashicorp.com' },
              { text: 'GitHub', href: 'http://github.com/hashicorp' },
            ]}
          />
        </>,
      ],
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
