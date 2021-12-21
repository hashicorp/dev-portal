import React from 'react'
import s from './style.module.css'

interface BreadcrumbLink {
  /** Text to be shown for the link */
  title: string
  /** The URL to link to. */
  url: string
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
        return (
          <li key={url} className={s.listItem}>
            <a className={s.link} href={url}>
              {title}
            </a>
            {isNotLastItem && <span className={s.divider}>/</span>}
          </li>
        )
      })}
    </ul>
  )
}

export type { BreadcrumbLink }
export default BreadcrumbBar
