import Link from 'next/link'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import SidebarNav from 'components/sidebar/components/sidebar-nav'
import { MenuItem } from 'components/sidebar'
import useCurrentPath from 'hooks/use-current-path'
import { formatCollectionToMenuItem, getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'

export default function CollectionView({
  collection,
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
          menuItems={[
            ...layoutProps.sidebarSections.flatMap((category): MenuItem[] => {
              return [
                { divider: true },
                { heading: category.title },
                ...category.items.map((c) =>
                  formatCollectionToMenuItem(c, currentPath)
                ),
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
    </SidebarSidecarLayout>
  )
}
