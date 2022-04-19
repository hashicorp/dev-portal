import Link from 'next/link'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'
import CollectionViewSidebar from './components/collection-view-sidebar'
import CollectionMeta from './components/collection-meta'

function CollectionView({
  collection,
  product,
  layoutProps,
}: CollectionPageProps): React.ReactElement {
  const { name, slug, description, shortName, tutorials } = collection

  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      headings={layoutProps.headings}
      sidebarSlot={
        <CollectionViewSidebar
          product={product}
          sections={layoutProps.sidebarSections}
        />
      }
    >
      <CollectionMeta
        heading={{ text: name, id: layoutProps.headings[0].slug }}
        description={description}
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
