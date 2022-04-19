import Link from 'next/link'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import ProductCollectionsSidebar from 'components/tutorials-sidebar/compositions/product-collections-sidebar'
import { getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'

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
        <ProductCollectionsSidebar
          product={{ name: product.name, slug: product.slug }}
          sections={layoutProps.sidebarSections}
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
    </SidebarSidecarLayout>
  )
}

CollectionView.layout = CoreDevDotLayout
export default CollectionView
