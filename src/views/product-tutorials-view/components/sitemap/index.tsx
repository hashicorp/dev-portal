import Link from 'next/link'
import {
  getCollectionSlug,
  getTutorialSlug,
} from 'views/collection-view/helpers'
import { ProductPageData } from 'views/product-tutorials-view/server'
import s from './sitemap.module.css'

export function ProductTutorialsSitemap({
  collections,
}: {
  collections: ProductPageData['allCollections']
}): React.ReactElement {
  return (
    <ul className={s.root}>
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
