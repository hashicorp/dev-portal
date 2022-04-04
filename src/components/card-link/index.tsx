import { ReactElement } from 'react'
import classNames from 'classnames'
import Card from 'components/card'
import MaybeInternalLink from 'components/maybe-internal-link'
import { CardLinkProps } from './types'
import s from './card-link.module.css'

const CardLink = ({
  children,
  className,
  href,
  'aria-label': ariaLabel,
}: CardLinkProps): ReactElement => {
  const classes = classNames(s.root, className)

  return (
    <MaybeInternalLink href={href} aria-label={ariaLabel}>
      <Card className={classes}>{children}</Card>
    </MaybeInternalLink>
  )
}

export type { CardLinkProps }
export default CardLink
