import Link from 'next/link'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
  TutorialLite as ClientTutorialLite,
  Collection as ClientCollection,
} from 'lib/learn-client/types'
import SidebarNav from 'components/sidebar/components/sidebar-nav'
import useCurrentPath from 'hooks/use-current-path'
import { getCollectionSlug, getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'

export default function CollectionView({
  collection,
  allProductCollections, // for sidebar section and sitemap
  product,
  layoutProps,
}: CollectionPageProps): React.ReactElement {
  const { name, slug, description, shortName, tutorials } = collection
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })

  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      headings={layoutProps.headings}
      sidebarSlot={
        <SidebarNav
          title={shortName}
          menuItems={allProductCollections.map(
            (collection: ClientCollection) => {
              const path = getCollectionSlug(collection.slug)
              return {
                title: collection.shortName,
                fullPath: path,
                id: collection.id,
                isActive: path === currentPath,
              }
            }
          )}
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
      <h2>Sidebar Data</h2>
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
