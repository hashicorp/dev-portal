import { getCollectionSlug } from 'views/collection-view/helpers'
import CardLink from 'components/card-link'
import { Collection as ClientCollection } from 'lib/learn-client/types'

interface FeaturedInCollectionsProps {
  collections: CollectionCardProps[]
}

// @TODO move this to the collection card component file when we make it
export interface CollectionCardProps
  extends Pick<
    ClientCollection,
    'id' | 'name' | 'slug' | 'theme' | 'description'
  > {
  numTutorials: number
}

// This should render the eventual `CollectionCard` component (doesn't exist yet)
// which will be used on many other views
export function FeaturedInCollections({
  collections,
}: FeaturedInCollectionsProps): React.ReactElement {
  if (collections.length === 0) {
    return null
  }

  return (
    <>
      <h2>Featured Collections</h2>
      <ul>
        {collections.map((c) => {
          return (
            <li key={c.id}>
              <CardLink href={getCollectionSlug(c.slug)}>
                <p>{c.numTutorials} Tutorials</p>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <p>{c.theme} Logo</p>
              </CardLink>
            </li>
          )
        })}
      </ul>
    </>
  )
}
