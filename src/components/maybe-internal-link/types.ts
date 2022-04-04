import { LinkProps } from 'next/link'

export type MaybeInternalLinkProps = {
  href: string
  as?: LinkProps['as']
} & Omit<React.HTMLProps<HTMLAnchorElement>, 'as'>
