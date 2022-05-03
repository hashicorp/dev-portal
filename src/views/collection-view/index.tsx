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
import CollectionTutorialList from './components/collection-tutorial-list'
import { formatTutorialCard } from 'components/tutorial-card/helpers'

function CollectionView({
  collection,
  layoutProps,
}: CollectionPageProps): React.ReactElement {
  const currentProduct = useCurrentProduct()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const { name, slug, description, tutorials, ordered } = collection

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
          {layoutProps.sidebarSections?.map(
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
      AlternateSidebar={TutorialsSidebar}
      sidebarNavDataLevels={sidebarNavDataLevels as any[]}
      sidecarSlot={null}
    >
      <CollectionMeta
        // Note: id is passed here because it is required by <Heading />,
        // it's not used for #anchor linking since there is no sidecar.
        heading={{ text: name, id: collection.id }}
        description={description}
        cta={{ href: getTutorialSlug(tutorials[0].slug, slug) }}
        numTutorials={tutorials.length}
      />
      <CollectionTutorialList
        isOrdered={ordered}
        tutorials={tutorials.map((t: ClientTutorialLite) =>
          formatTutorialCard(t, slug)
        )}
      />
    </SidebarSidecarLayout>
  )
}

CollectionView.layout = CoreDevDotLayout
export default CollectionView
