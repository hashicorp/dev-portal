import { ProductOption } from 'lib/learn-client/types'

export interface BrandedCalloutProps {
  heading: string
  /** headingSlug is optional cause not in raw data, added later */
  headingSlug?: string
  cta: {
    text: string
    url: string
  }
  subheading?: string
  product?: ProductOption
}
