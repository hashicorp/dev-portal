import React from 'react'
import s from './style.module.css'

interface BreadcrumbLink {
  /** Text to be shown for the link */
  title: string
  /** The URL to link to. May be omitted for index-less routes. */
  url?: string
}

function BreadcrumbBar({
  links,
}: {
  links: BreadcrumbLink[]
}): React.ReactElement {
  return (
    <ul className={s.root}>
      {links.map(({ title, url }, idx, arr) => {
        const isNotLastItem = idx != arr.length - 1
        const Elem = url ? 'a' : 'span'
        return (
          <li key={url} className={s.listItem}>
            <Elem className={s.breadcrumbText} href={url}>
              {title}
            </Elem>
            {isNotLastItem && <span className={s.divider}>/</span>}
          </li>
        )
      })}
    </ul>
  )
}

export type { BreadcrumbLink }
export default BreadcrumbBar
