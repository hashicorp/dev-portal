import React from 'react'
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
        {links.map(({ title, url, isCurrentPage }, idx, arr) => {
          const isNotLastItem = idx != arr.length - 1
          const Elem = url ? 'a' : 'span'
          return (
            <li key={url} className={s.listItem}>
              <Elem
                className={s.breadcrumbText}
                href={url}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {title}
              </Elem>
              {isNotLastItem && <span className={s.divider}>/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export type { BreadcrumbLink }
export default BreadcrumbBar
