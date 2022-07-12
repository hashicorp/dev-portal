import { ReactEventHandler, ReactNode } from 'react'
import Link from 'next/link'
import { Hit } from '@algolia/client-search'

type HitWrapperProps<THit extends Hit<unknown>> = {
  /**
   * An option onClick handler to be passed to the anchor tag wrapping the Hit
   */
  onHitClick?: ReactEventHandler<HTMLAnchorElement>

  /**
   * Search result object received from the Algolia query
   */
  hit: THit

  /**
   * Children rendered within the Hit link
   */
  children: ReactNode

  /**
   * An optional className to be applied to the Hit link
   */
  className?: string

  /**
   * A function which returns the props necessary to render a next/link which navigates to
   * the hit result
   */
  getHitLinkProps: (hit: THit) => { href: { pathname: string; hash?: string } }
}

/**
 * Next.js specific wrapper for search result hits to integrate with next/link
 */
export default function HitWrapper<THit extends Hit<unknown>>({
  onHitClick = () => void 0,
  hit,
  children,
  className,
  getHitLinkProps,
}: HitWrapperProps<THit>) {
  const linkProps = getHitLinkProps(hit)

  return (
    <Link {...linkProps}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- Link above passes an href */}
      <a onClick={onHitClick} className={className}>
        {children}
      </a>
    </Link>
  )
}
