import Link from 'next/link'
import { getTutorialSlug } from './helpers'
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
        {tutorials.map((tutorial) => {
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
    </>
  )
}
