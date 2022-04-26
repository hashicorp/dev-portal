import { FeaturedStack } from '../featured-stack'
import { TutorialsStackProps } from './types'
import s from './tutorials-stack.module.css'

function TutorialsStack({
  featuredTutorials,
  heading,
  subheading,
}: TutorialsStackProps): JSX.Element {
  return (
    <FeaturedStack heading={heading} subheading={subheading}>
      <pre className={s.placeholder}>
        <code>
          {JSON.stringify(
            { component: 'TutorialsStack', featuredTutorials },
            null,
            2
          )}
        </code>
      </pre>
    </FeaturedStack>
  )
}

export type { TutorialsStackProps }
export { TutorialsStack }
