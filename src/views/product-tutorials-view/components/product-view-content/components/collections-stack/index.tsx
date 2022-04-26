import { FeaturedStack } from '../featured-stack'
import { CollectionsStackProps } from './types'
import s from './collections-stack.module.css'

// Reminder:  make sure heap stuff is carried forward
// const HEAP_ID = 'CollectionCard'

function CollectionsStack({
  featuredCollections,
  heading,
  headingSlug,
  subheading,
}: CollectionsStackProps): JSX.Element {
  return (
    <FeaturedStack
      heading={heading}
      headingSlug={headingSlug}
      subheading={subheading}
    >
      <pre className={s.placeholder}>
        <code>
          {JSON.stringify(
            { component: 'CollectionsStack', featuredCollections },
            null,
            2
          )}
        </code>
      </pre>
    </FeaturedStack>
  )
}

export type { CollectionsStackProps }
export { CollectionsStack }
