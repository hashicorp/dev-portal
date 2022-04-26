import { FeaturedStackProps } from './types'
import s from './featured-stack.module.css'

function FeaturedStack({
  heading,
  headingSlug,
  subheading,
  children,
}: FeaturedStackProps): React.ReactElement {
  return (
    <div className={s.root}>
      <h2 id={headingSlug}>{heading}</h2>
      <pre className={s.placeholder}>
        <code>
          {JSON.stringify(
            {
              component: 'FeaturedStack',
              heading,
              subheading,
            },
            null,
            2
          )}
        </code>
      </pre>
      {children}
    </div>
  )
}

export type { FeaturedStackProps }
export { FeaturedStack }
