import { ReactEventHandler, ReactNode } from 'react'
import Link from 'next/link'
import { Hit } from '@algolia/client-search'

/**
 * Next.js specific wrapper for search result hits to integrate with next/link
 */
export default function HitWrapper<THit extends Hit<unknown>>({
  onHitClick = () => void 0,
  hit,
  children,
  className,
  getHitLinkProps,
}: {
  onHitClick?: ReactEventHandler<HTMLAnchorElement>
  hit: THit
  children: ReactNode
  className?: string
  getHitLinkProps: (hit: THit) => { href: { pathname: string; hash?: string } }
}) {
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
