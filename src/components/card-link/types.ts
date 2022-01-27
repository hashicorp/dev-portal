import { ReactNode } from 'react'
import { CardProps } from 'components/card'

export interface CardLinkProps {
  /**
   * The element(s) to render within the `CardLink` body.
   */
  children: ReactNode

  /**
   * A string of one or more classnames passed to the inner `Card` component.
   */
  className?: string

  /**
   * The elevation passed to the inner `Card` component. Cannot be "base" since
   * that is reserved for non-interactive cards.
   * */
  elevation?: Exclude<CardProps['elevation'], 'base'>

  /**
   * The destination of the link.
   */
  href: string
}
