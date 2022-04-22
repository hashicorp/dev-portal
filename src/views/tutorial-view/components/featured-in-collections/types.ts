import { CollectionCardProps } from 'components/collection-card/types'

export type CollectionCardPropsWithId = CollectionCardProps & { id: string }

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
