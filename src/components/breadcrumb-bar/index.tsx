import React from 'react'
import Link from 'next/link'
import s from './style.module.css'

interface BreadcrumbLink {
  /** Text to be shown for the link */
  title: string
  /** The URL to link to. May be omitted for index-less routes. */
  url?: string
  /** Whether this breadcrumb represents the current page */
  isCurrentPage?: boolean
}

function BreadcrumbBar({
  links,
}: {
  links: BreadcrumbLink[]
}): React.ReactElement {
  return (
    <nav aria-label="Breadcrumb" className={s.root}>
      <ol className={s.listRoot}>
        {links.map(({ title, url, isCurrentPage }) => {
          const Elem = url ? InternalLink : 'span'
          return (
            <li key={`${title}_${url}`} className={s.listItem}>
              <Elem
                className={s.breadcrumbText}
                href={url}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {title}
              </Elem>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function InternalLink({ href, children, ...rest }) {
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  )
}

export type { BreadcrumbLink }
export default BreadcrumbBar
