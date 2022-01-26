import React from 'react'
import Link from 'next/link'
import s from './style.module.css'
import isAbsoluteUrl from 'lib/is-absolute-url'
import Text from 'components/text'

interface BreadcrumbLink {
  /** Text to be shown for the link */
  title: string
  /** The URL to link to. Must be internal, ie must not be an absolute URL. May be omitted for index-less routes. */
  url?: string
  /** Whether this breadcrumb represents the current page */
  isCurrentPage?: boolean
}

function BreadcrumbBar({
  links,
}: {
  links: BreadcrumbLink[]
}): React.ReactElement {
  // For now, we want to strictly require that all
  // breadcrumb link URLs, if present, are relative rather
  // than absolute links
  links
    .filter((l) => Boolean(l.url))
    .forEach((l) => {
      if (isAbsoluteUrl(l.url)) {
        throw new Error(
          `Absolute URL passed to BreadcrumbBar: "${JSON.stringify(
            l
          )}". Please ensure all "link.url" values are relative links.`
        )
      }
    })
  // Now that we're sure all links are relative,
  // we can render the breadcrumb links
  return (
    <nav aria-label="Breadcrumb" className={s.root}>
      <ol className={s.listRoot}>
        {links.map(({ title, url, isCurrentPage }) => {
          const cleanTitle = title.replace(/<[^>]+>/g, '')
          const Elem = url ? InternalLink : 'span'
          return (
            <Text
              asElement="li"
              className={s.listItem}
              key={`${cleanTitle}_${url}`}
              size={100}
              weight="regular"
            >
              <Elem
                className={s.breadcrumbText}
                href={url}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {cleanTitle}
              </Elem>
            </Text>
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
