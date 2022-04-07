import {
  TutorialLite as ClientTutorialLite,
  Collection as ClientCollection,
} from 'lib/learn-client/types'
import Link from 'next/link'
import { getCollectionSlug, getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'

export default function CollectionView({
  collection,
  allProductCollections, // for sidebar section
  product,
}: CollectionPageProps): React.ReactElement {
  const { name, slug, description, tutorials } = collection

  return (
    <>
      <h1>{name}</h1>
      <p>{description}</p>
      <ol>
        {tutorials.map((tutorial: ClientTutorialLite) => {
          const tutorialSlug = getTutorialSlug(tutorial.slug, slug)
          return (
            <li key={tutorial.id}>
              <Link href={tutorialSlug}>
                <a>{tutorial.name}</a>
              </Link>
            </li>
          )
        })}
      </ol>
      <h2>Sidebar Data</h2>
      <ul>
        {allProductCollections.map((collection: ClientCollection) => {
          const collectionSlug = getCollectionSlug(collection.slug)
          return (
            <li key={collection.id}>
              <Link href={collectionSlug}>
                <a>{collection.shortName}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
