import Link from 'next/link'
import {
  getCollectionSlug,
  getTutorialSlug,
} from 'views/collection-view/helpers'
import { ProductPageData } from 'views/product-tutorials-view/server'

export function ProductTutorialsSitemap({
  collections,
}: {
  collections: ProductPageData['pageData']['allCollections']
}): React.ReactElement {
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
