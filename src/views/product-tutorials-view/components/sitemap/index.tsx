import Link from 'next/link'
import classNames from 'classnames'
import {
  getCollectionSlug,
  getTutorialSlug,
} from 'views/collection-view/helpers'
import {
  Collection as ClientCollection,
  ProductOption,
  TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { ProductPageData } from 'views/product-tutorials-view/server'
import Heading from 'components/heading'
import IconTile from 'components/icon-tile'
import { IconCollections24 } from '@hashicorp/flight-icons/svg-react/collections-24'
import { getSitemapHeading } from 'views/product-tutorials-view/helpers/heading-helpers'
import s from './sitemap.module.css'

export function ProductTutorialsSitemap({
  collections,
  product,
}: {
  collections: ProductPageData['allCollections']
  product: ProductOption
}): React.ReactElement {
  const { title, level, slug } = getSitemapHeading()

  return (
    <div className={s.root}>
      <div className={s.headingBar}>
        <Heading
          id={slug}
          size={300}
          level={level}
          weight="bold"
          className={s.heading}
        >
          {title}
        </Heading>
      </div>
      <ul className={s.collectionListRoot}>
        {collections.map((collection: ClientCollection) => (
          <li key={collection.id} className={s.collectionListItem}>
            <div className={s.collectionLinkSizer}>
              <Link href={getCollectionSlug(collection.slug)}>
                <a className={s.collectionLink}>
                  <span className={s.collectionLinkIcon}>
                    <IconTile size="small" brandColor={product}>
                      <IconCollections24 />
                    </IconTile>
                  </span>
                  <span>{collection.name}</span>
                </a>
              </Link>
            </div>
            <ul
              className={classNames(s.tutorialListRoot, {
                [s.hasMultipleItems]: collection.tutorials.length > 1,
              })}
            >
              {collection.tutorials.map((t: ClientTutorialLite) => (
                <li key={t.id} className={s.tutorialListItem}>
                  <Link href={getTutorialSlug(t.slug, collection.slug)}>
                    <a className={s.tutorialLink}>{t.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
