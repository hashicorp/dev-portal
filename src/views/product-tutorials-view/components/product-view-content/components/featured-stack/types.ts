import { ReactNode } from 'react'

export interface FeaturedStackProps {
  heading: string
  /** An optional subheading. Supports HTML. */
  subheading?: string
  children: ReactNode
}
