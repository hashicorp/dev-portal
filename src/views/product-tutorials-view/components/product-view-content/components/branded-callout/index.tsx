import { BrandedCalloutProps } from './types'
import s from './branded-callout.module.css'

function BrandedCallout({
  heading,
  subheading,
  cta,
  product,
}: BrandedCalloutProps) {
  return (
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
  )
}

export type { BrandedCalloutProps }
export { BrandedCallout }
