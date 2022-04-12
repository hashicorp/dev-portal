import Link from 'next/link'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
  TutorialLite as ClientTutorialLite,
  Collection as ClientCollection,
  CollectionCategoryOption,
} from 'lib/learn-client/types'
import SidebarNav from 'components/sidebar/components/sidebar-nav'
import useCurrentPath from 'hooks/use-current-path'
import { getCollectionSlug, getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'
import { MenuItem } from 'components/sidebar'

export default function CollectionView({
  collection,
  allProductCollections, // for sidebar section and sitemap
  product,
  layoutProps,
}: CollectionPageProps): React.ReactElement {
  const { name, slug, description, shortName, tutorials } = collection
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const sidebarSections = formatAllCollectionsMenuItems(
    allProductCollections,
    currentPath
  )

  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      headings={layoutProps.headings}
      sidebarSlot={
        <SidebarNav
          title={shortName}
          menuItems={[
            ...sidebarSections.flatMap((category): MenuItem[] => {
              return [
                { divider: true },
                { heading: category.title },
                ...category.items,
              ]
            }),
          ]}
        />
      }
    >
      <h1 id={layoutProps.headings[0].slug}>{name}</h1>
      <p>{description}</p>
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
      <h2>Sitemap Data</h2>
      <ul>
        {allProductCollections.map((collection: ClientCollection) => {
          const collectionSlug = getCollectionSlug(collection.slug)
          return (
            <li key={collection.id}>
              <Link href={collectionSlug}>
                <a>{collection.shortName}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </SidebarSidecarLayout>
  )
}

function formatAllCollectionsMenuItems(
  collections: ClientCollection[],
  currentPath: string
): { title: CollectionCategoryOption; items: MenuItem[] }[] {
  const categorySlugs = Object.keys(CollectionCategoryOption)

  const sortedSidebarCategories = categorySlugs.map(
    (category: CollectionCategoryOption) => {
      // get collections associated with that category
      const associatedCollections = collections.filter(
        (c: ClientCollection) => c.category === category
      )
      // sort collections alphabetically & map into DefaultCollection shape
      const items = associatedCollections.map(
        (collection: ClientCollection) => {
          const path = getCollectionSlug(collection.slug)
          return {
            title: collection.shortName,
            fullPath: path,
            id: collection.id,
            isActive: path === currentPath,
          }
        }
      )

      return {
        title: CollectionCategoryOption[category],
        items,
      }
    }
  )

  return filterEmptySections(sortedSidebarCategories)
}

function filterEmptySections(sections) {
  return sections.filter((c) => c.items.length > 0)
}
