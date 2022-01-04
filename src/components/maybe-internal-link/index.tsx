import Link from 'next/link'
import isAbsoluteUrl from 'lib/is-absolute-url'
import React from 'react'

function MaybeInternalLink({
  href,
  ...rest
}: {
  href: string
} & React.HTMLProps<HTMLAnchorElement>): React.ReactElement {
  const Elem = isAbsoluteUrl(href) ? InternalLink : 'a'
  return <Elem href={href} {...rest} />
}

function InternalLink({ href, ...rest }) {
  return (
    <Link href={href}>
      {/* Disabling anchor-has-content, children is in ...rest  */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a {...rest} />
    </Link>
  )
}

export default MaybeInternalLink
