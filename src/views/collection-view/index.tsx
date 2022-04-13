import Link from 'next/link'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import useCurrentPath from 'hooks/use-current-path'
import { formatCollectionToSectionItem, getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'
import TutorialsSidebar, {
  HorizontalRule,
  SectionList,
  SectionTitle,
} from 'components/tutorials-sidebar'

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
        <TutorialsSidebar
          title={`${product.name} Tutorials`}
          backToLink={{
            text: `${product.name} Home`,
            href: `/${product.slug}`,
          }}
        >
          <SectionList
            items={[
              {
                text: 'Overview',
                href: `${product.slug}/tutorials`,
                isActive: false,
              },
            ]}
          />
          {layoutProps.sidebarSections.map((section) => {
            return (
              <>
                <HorizontalRule />
                <SectionTitle text={section.title} />
                <SectionList
                  items={section.items.map((item) =>
                    formatCollectionToSectionItem(item, currentPath)
                  )}
                />
              </>
            )
          })}
        </TutorialsSidebar>
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
