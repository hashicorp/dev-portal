import { ReactNode } from 'react'

export interface FeaturedStackProps {
  heading: string
  /** headingSlug is optional cause not in raw data, added later */
  headingSlug?: string
  /** An optional subheading. Supports HTML. */
  subheading?: string
  children: ReactNode
}
