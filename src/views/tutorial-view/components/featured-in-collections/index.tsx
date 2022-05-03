import CollectionCard, {
  CollectionCardPropsWithId,
} from 'components/collection-card'
import { FeaturedInCollectionsProps } from './types'
import s from './featured-in-collections.module.css'

// This should render the eventual `CollectionCard` component (doesn't exist yet)
// which will be used on many other views
export function FeaturedInCollections({
  className,
  collections,
}: FeaturedInCollectionsProps): React.ReactElement {
  if (collections.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <h2 className={s.heading}>This tutorial also appears in:</h2>
      <ul className={s.listRoot}>
        {collections.map((collection: CollectionCardPropsWithId) => {
          const { description, heading, id, productsUsed, tutorialCount, url } =
            collection

          return (
            <li key={id} className={s.listItem}>
              <CollectionCard
                description={description}
                heading={heading}
                productsUsed={productsUsed}
                tutorialCount={tutorialCount}
                url={url}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FeaturedInCollections
