import Link from 'next/link'
import React from 'react'
import { getCollectionSlug } from 'views/collection-view/helpers'
import { ProductTutorialsPageProps } from './server'

export default function ProductTutorialsView({
  pageData,
  collections,
  product,
}: ProductTutorialsPageProps): React.ReactElement {
  console.log({ pageData })
  return (
    <>
      <h1>{product.name} Tutorials</h1>
      <h2>All Collections</h2>
      <AllProductCollections collections={collections} />
    </>
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
