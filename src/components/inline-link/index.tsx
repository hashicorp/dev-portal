import { ReactElement } from 'react'
import classNames from 'classnames'
import MaybeInternalLink from 'components/maybe-internal-link'
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
    <MaybeInternalLink className={classes} href={href} {...rest}>
      {children}
    </MaybeInternalLink>
  )
}

export type { InlineLinkProps }
export default InlineLink
