import { CollectionCardPropsWithId } from 'components/collection-card/types'
export interface FeaturedInCollectionsProps {
  /**
   * An array of collections to display.
   */
  collections: CollectionCardPropsWithId[]

  /**
   * Optional className to put on the root element. Useful for spacing.
   */
  className?: string
}
