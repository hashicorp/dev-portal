import Link from 'next/link'
import { getCollectionSlug } from './helpers'

export default function ProductTutorialsView({ collections, product }) {
  return (
    <>
      <h1>{product.name} Tutorials</h1>
      <h2>All Collections</h2>
      <AllProductCollections collections={collections} />
    </>
  )
}

function AllProductCollections({ collections }) {
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
