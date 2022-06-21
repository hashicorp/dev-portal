import { ReactElement } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { InlineLinkProps } from './types'
import s from './inline-link.module.css'

const InlineLink = ({
  className,
  href,
  textSize = 300,
  textWeight = 'regular',
  children,
  ...rest
}: InlineLinkProps): ReactElement => {
  const classes = classNames(
    s.root,
    `hds-typography-body-${textSize}`,
    `hds-font-weight-${textWeight}`,
    className
  )

  return (
    <Link href={href}>
      <a {...rest} className={classes}>
        {children}
      </a>
    </Link>
  )
}

export type { InlineLinkProps }
export default InlineLink
