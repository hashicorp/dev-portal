import { ReactNode } from 'react'
import { MaybeInternalLinkProps } from 'components/maybe-internal-link'

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

  /**
   * An optional string value that labels the link. For use when content visible
   * in the DOM meant to give the link meaning is either missing, or does not
   * accurately describe the link.
   */
  ariaLabel?: MaybeInternalLinkProps['aria-label']
}
