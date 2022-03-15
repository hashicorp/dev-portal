import { ReactElement } from 'react'
import classNames from 'classnames'
import { CardLinkProps, CardProps } from './types'
import MaybeInternalLink from 'components/maybe-internal-link'
import s from './card.module.css'

const Card = ({
  children,
  className,
  elevation = 'mid',
}: CardProps): ReactElement => {
  const classes = classNames(`hds-surface-${elevation}`, s.root, className)

  return <div className={classes}>{children}</div>
}

const CardLink = ({
  children,
  className,
  href,
}: CardLinkProps): ReactElement => {
  const classes = classNames(`hds-surface-mid`, s.root, s.linked, className)

  return (
    <MaybeInternalLink className={classes} href={href}>
      {children}
    </MaybeInternalLink>
  )
}

export { CardLink }
export type { CardProps, CardLinkProps }
export default Card
