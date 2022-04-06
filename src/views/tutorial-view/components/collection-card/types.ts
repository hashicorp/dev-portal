import { Collection as ClientCollection } from 'lib/learn-client/types'

export interface CollectionCardProps
  extends Pick<
    ClientCollection,
    'id' | 'name' | 'slug' | 'theme' | 'description'
  > {
  /**
   * Optional class name to pass to the root element, which is expected to be
   * the underlying CardLink component.
   */
  className?: string

  /**
   * TODO: add description
   */
  numTutorials: number
}
