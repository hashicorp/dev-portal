import React from 'react'
import Link from 'next/link'
import isAbsoluteUrl from 'lib/is-absolute-url'
import { MaybeInternalLinkProps } from './types'

function MaybeInternalLink({
  href,
  as,
  ...rest
}: MaybeInternalLinkProps): React.ReactElement {
  const Elem = isAbsoluteUrl(href) ? InternalLink : 'a'
  return <Elem href={href} {...rest} />
}

function InternalLink({ href, as, ...rest }: MaybeInternalLinkProps) {
  return (
    <Link href={href} as={as}>
      {/* Disabling anchor-has-content, children is in ...rest  */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a {...rest} />
    </Link>
  )
}

export default MaybeInternalLink
