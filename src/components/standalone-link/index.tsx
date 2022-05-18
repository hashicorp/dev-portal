import { ReactElement } from 'react'
import classNames from 'classnames'
import MaybeInternalLink from 'components/maybe-internal-link'
import { StandaloneLinkProps } from './types'
import s from './standalone-link.module.css'

const StandaloneLink = ({
  ariaLabel,
  className,
  color = 'primary',
  download,
  href,
  icon,
  iconPosition,
  onClick,
  openInNewTab = false,
  size = 'medium',
  text,
}: StandaloneLinkProps): ReactElement => {
  const classes = classNames(s.root, s[`color-${color}`], s[size], className)

  return (
    <MaybeInternalLink
      aria-label={ariaLabel}
      className={classes}
      download={download}
      href={href}
      onClick={onClick}
      rel={openInNewTab ? 'noreferrer noopener' : undefined}
      target={openInNewTab ? '_blank' : '_self'}
    >
      {iconPosition === 'leading' && icon}
      <span className={s.text}>{text}</span>
      {iconPosition === 'trailing' && icon}
    </MaybeInternalLink>
  )
}

export type { StandaloneLinkProps }
export default StandaloneLink
