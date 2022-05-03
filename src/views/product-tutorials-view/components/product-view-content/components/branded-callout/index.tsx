import { BrandedCalloutProps } from './types'
import s from './branded-callout.module.css'

function BrandedCallout({
  heading,
  subheading,
  cta,
  product,
}: BrandedCalloutProps) {
  return (
    <div>
      <div>{heading}</div>
      <pre className={s.placeholder}>
        <code>
          {JSON.stringify(
            {
              component: 'BrandedCallout',
              heading,
              subheading,
              cta,
              product,
            },
            null,
            2
          )}
        </code>
      </pre>
    </div>
  )
}

export type { BrandedCalloutProps }
export { BrandedCallout }
