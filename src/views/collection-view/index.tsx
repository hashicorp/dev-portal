import Link from 'next/link'
import { Collection as ClientCollection } from 'lib/learn-client/types'
import { getTutorialSlug } from './helpers'

export default function CollectionView({
  name,
  slug,
  description,
  tutorials,
}: ClientCollection): React.ReactElement {
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
