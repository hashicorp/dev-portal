import { ReactNode } from 'react'

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
   * The destination of the link.
   */
  href: string
}
