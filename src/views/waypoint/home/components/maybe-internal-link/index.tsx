import Link from 'next/link'
import isAbsoluteUrl from 'lib/is-absolute-url'
import React from 'react'

function MaybeInternalLink({
  href,
  children,
  ...rest
}: {
  href: string
  children: React.ReactNode
} & React.HTMLProps<HTMLAnchorElement>): React.ReactElement {
  const Elem = isAbsoluteUrl(href) ? InternalLink : 'a'
  return (
    <Elem href={href} {...rest}>
      {children}
    </Elem>
  )
}

function InternalLink({ href, children, ...rest }) {
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  )
}

export default MaybeInternalLink
