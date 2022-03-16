import { ReactElement } from 'react'
import classNames from 'classnames'
import MaybeInternalLink from 'components/maybe-internal-link'
import { CardLinkProps } from './types'
import s from './card-link.module.css'

const CardLink = ({
  children,
  className,
  href,
}: CardLinkProps): ReactElement => {
  const classes = classNames(`hds-surface-mid`, s.root, className)

  return (
    <MaybeInternalLink className={classes} href={href}>
      {children}
    </MaybeInternalLink>
  )
}

export type { CardLinkProps }
export default CardLink
