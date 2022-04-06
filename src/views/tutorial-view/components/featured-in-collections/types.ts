import { CollectionCardProps } from 'views/tutorial-view/components/collection-card'

export interface FeaturedInCollectionsProps {
  /**
   * An array of collections to display.
   */
  collections: CollectionCardProps[]

  /**
   * Optional className to put on the root element. Useful for spacing.
   */
  className?: string
}
