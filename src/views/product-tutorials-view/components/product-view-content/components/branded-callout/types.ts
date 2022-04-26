import { ProductOption } from 'lib/learn-client/types'

export interface BrandedCalloutProps {
  heading: string
  /**
   * Identifier for the heading, which should unique in the context of the page
   * Note: headingSlug is added after fetching content from the Learn API
   */
  headingSlug: string
  cta: {
    text: string
    url: string
  }
  subheading?: string
  product: ProductOption
}
