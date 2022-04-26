import Link from 'next/link'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import ProductCollectionsSidebar from 'components/tutorials-sidebar/compositions/product-collections-sidebar'
import { getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'
import CollectionMeta from './components/collection-meta'
import CollectionTutorialList from './components/collection-tutorial-list'
import { formatTutorialCard } from 'components/tutorial-card/helpers'

function CollectionView({
  collection,
  product,
  layoutProps,
}: CollectionPageProps): React.ReactElement {
  const { name, slug, description, tutorials, ordered } = collection

  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      sidecarSlot={null}
      sidebarSlot={
        <ProductCollectionsSidebar
          product={{ name: product.name, slug: product.slug }}
          sections={layoutProps.sidebarSections}
        />
      }
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
