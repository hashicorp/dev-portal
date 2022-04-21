import Link from 'next/link'
import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct } from 'contexts'
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
import { CollectionCategorySidebarSection, getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'
import CollectionMeta from './components/collection-meta'

function CollectionView({
  collection,
  layoutProps,
}: CollectionPageProps): React.ReactElement {
  const currentProduct = useCurrentProduct()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const { name, slug, description, tutorials } = collection

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
      <CollectionMeta
        heading={{ text: name, id: layoutProps.headings[0].slug }}
        description={description}
        cta={{ href: getTutorialSlug(tutorials[0].slug, slug) }}
        numTutorials={tutorials.length}
      />
      <h2 id={layoutProps.headings[1].slug}>Tutorials</h2>
      <ol>
        {tutorials.map((tutorial: ClientTutorialLite) => {
          const tutorialSlug = getTutorialSlug(tutorial.slug, slug)
          return (
            <li key={tutorial.id}>
              <Link href={tutorialSlug}>
                <a>{tutorial.name}</a>
              </Link>
            </li>
          )
        })}
      </ol>
    </SidebarSidecarLayout>
  )
}

CollectionView.layout = CoreDevDotLayout
export default CollectionView
