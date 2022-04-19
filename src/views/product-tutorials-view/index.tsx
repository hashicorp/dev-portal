import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Link from 'next/link'
import React from 'react'
import TutorialsSidebar, {
  SectionList,
  HorizontalRule,
  SectionTitle,
} from 'components/tutorials-sidebar'
import { getCollectionSlug } from 'views/collection-view/helpers'
import { ProductTutorialsPageProps } from './server'

export default function ProductTutorialsView({
  layoutProps,
  pageData,
  collections,
  product,
}: ProductTutorialsPageProps): React.ReactElement {
  console.log({ pageData }, { layoutProps })
  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      headings={layoutProps.headings}
      sidebarSlot={
        <TutorialsSidebar
          title="Tutorials"
          backToLink={{
            text: `${product.name} Home`,
            href: `/${product.slug}`,
          }}
        >
          <SectionList
            items={[
              {
                text: 'Overview',
                href: `/${product.slug}/tutorials`,
                isActive: true,
              },
            ]}
          />
          {layoutProps.sidebarSections.map((section) => {
            return (
              <>
                <HorizontalRule />
                <SectionTitle text={section.title} />
                <SectionList items={section.items} />
              </>
            )
          })}
        </TutorialsSidebar>
      }
    >
      <h1>{product.name} Tutorials</h1>
      <h2>All Collections</h2>
      <AllProductCollections collections={collections} />
    </SidebarSidecarLayout>
  )
}

function AllProductCollections({
  collections,
}: Pick<ProductTutorialsPageProps, 'collections'>): React.ReactElement {
  return (
    <ul>
      {collections.map((collection) => (
        <li key={collection.id}>
          <Link href={getCollectionSlug(collection.slug)}>
            <a>{collection.shortName}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}
