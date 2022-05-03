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
import IconTile from 'components/icon-tile'
import { IconCollections24 } from '@hashicorp/flight-icons/svg-react/collections-24'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { getSitemapHeading } from 'views/product-tutorials-view/helpers/heading-helpers'
import StandaloneLink from 'components/standalone-link'
import s from './sitemap.module.css'

export function ProductTutorialsSitemap({
  collections,
  product,
}: {
  collections: ProductPageData['allCollections']
  product: ProductOption
}): React.ReactElement {
  const { title, level, slug } = getSitemapHeading()
  const HeadingElem = `h${level}` as React.ElementType

  return (
    <div className={s.root}>
      <div className={s.headingBar}>
        <HeadingElem id={slug} className={s.heading}>
          {title}
        </HeadingElem>
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
