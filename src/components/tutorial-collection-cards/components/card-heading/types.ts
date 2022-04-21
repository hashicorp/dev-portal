import type { HeadingProps } from 'components/heading'
import { CompanyLogoOption } from './company-logo/types'

export interface CardHeadingProps {
  text: string
  level: HeadingProps['level']

  /**
   * Optionally render a logo as the heading of the card.
   * Used by CollectionCard.
   */
  logo?: CompanyLogoOption
}

export { CompanyLogoOption }
