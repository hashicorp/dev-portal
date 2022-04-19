import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Link from 'next/link'
import React from 'react'
import TutorialsSidebar, {
  SectionList,
  HorizontalRule,
  SectionTitle,
} from 'components/tutorials-sidebar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import {
  getCollectionSlug,
  getTutorialSlug,
} from 'views/collection-view/helpers'

import { ProductTutorialsPageProps } from './server'

function ProductTutorialsView({
  layoutProps,
  data,
  product,
}: ProductTutorialsPageProps): React.ReactElement {
  const { showProductSitemap, blocks, collections } = data.pageData
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
      <h1 id={layoutProps.headings[0].slug}>{product.name} Tutorials</h1>
      {blocks.map((b, i) => (
        <>
          <h3>Block type: {b.type}</h3>
          <p key={`${b.type}-${i}`}>{b.heading}</p>
        </>
      ))}
      <h2 id={layoutProps.headings[layoutProps.headings.length - 1].slug}>
        All tutorials
      </h2>
      {showProductSitemap ? (
        <AllProductCollections collections={collections} />
      ) : null}
    </SidebarSidecarLayout>
  )
}

ProductTutorialsView.layout = CoreDevDotLayout
export default ProductTutorialsView

function AllProductCollections({ collections }): React.ReactElement {
  // @TODO render the tutorial links as well. this data is within the collection
  return (
    <ul>
      {collections.map((collection) => (
        <li key={collection.id}>
          <Link href={getCollectionSlug(collection.slug)}>
            <a>{collection.shortName}</a>
          </Link>
          <ul>
            {collection.tutorials.map((t) => (
              <li key={t.id}>
                <Link href={getTutorialSlug(t.slug, collection.slug)}>
                  <a>{t.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
