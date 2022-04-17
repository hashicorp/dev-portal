import Link from 'next/link'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'

function CollectionView({
  collection,
  product,
  layoutProps,
}: CollectionPageProps): React.ReactElement {
  const { name, slug, description, tutorials } = collection

  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      headings={layoutProps.headings}
      sidebarProps={{
        backToLinkProps: {
          text: `${product.name} Home`,
          url: `/${product.slug}`,
        },
        menuItems: layoutProps.sidebarNavItems,
        showFilterInput: false,
        title: 'Tutorials',
      }}
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
