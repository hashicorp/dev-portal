import { Fragment } from 'react'
import slugify from 'slugify'
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
import { ProductTutorialsPageProps } from './server'

function ProductTutorialsView({
  layoutProps,
  data,
}: ProductTutorialsPageProps): React.ReactElement {
  const currentProduct = useCurrentProduct()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const { showProductSitemap, blocks, allCollections } = data.pageData

  // TODO: refactor, very long
  const sidebarNavDataLevels = [
    {
      levelButtonProps: {
        levelDownButtonText: `${currentProduct.name} Home`,
      },
      menuItems: generateTopLevelSidebarNavData(),
      showFilterInput: false,
      title: 'Main Menu',
    },
    {
      levelButtonProps: {
        levelUpButtonText: 'Main Menu',
        levelDownButtonText: 'Previous',
      },
      menuItems: generateProductLandingSidebarNavData(currentProduct),
      showFilterInput: false,
      title: currentProduct.name,
    },
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
          {layoutProps.collectionViewSidebarSections.map(
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

  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      headings={layoutProps.headings}
      AlternateSidebar={TutorialsSidebar}
      sidebarNavDataLevels={sidebarNavDataLevels as any[]}
    >
      <h1 id={layoutProps.headings[0].slug}>{currentProduct.name} Tutorials</h1>
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
          <ProductTutorialsSitemap collections={allCollections} />
        </>
      ) : null}
    </SidebarSidecarLayout>
  )
}

ProductTutorialsView.layout = CoreDevDotLayout
export default ProductTutorialsView
