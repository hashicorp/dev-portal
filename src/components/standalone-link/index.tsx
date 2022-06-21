import { ReactElement } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
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
  textClassName,
}: StandaloneLinkProps): ReactElement => {
  const classes = classNames(s.root, s[`color-${color}`], s[size], className)
  const rel = openInNewTab ? 'noreferrer noopener' : undefined
  const target = openInNewTab ? '_blank' : '_self'

  return (
    <Link href={href}>
      {/* TODO double check usage of the `onClick` prop */}
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        aria-label={ariaLabel}
        className={classes}
        download={download}
        onClick={onClick}
        rel={rel}
        target={target}
      >
        {iconPosition === 'leading' && icon}
        <span className={classNames(s.text, textClassName)}>{text}</span>
        {iconPosition === 'trailing' && icon}
      </a>
    </Link>
  )
}

export type { StandaloneLinkProps }
export default StandaloneLink
