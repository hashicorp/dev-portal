import classNames from 'classnames'
import { BadgeProps } from './types'
import s from './badge.module.css'

const Badge = ({
  ariaDescribedBy,
  ariaLabel,
  ariaLabelledBy,
  className,
  color = 'neutral',
  icon,
  size = 'medium',
  text,
  type = 'filled',
}: BadgeProps) => {
  const classes = classNames(s.root, s[size], s[`${type}-${color}`], className)
  const hasIcon = !!icon
  const hasText = !!text
  const hasLabel = !!ariaDescribedBy || !!ariaLabel || !!ariaLabelledBy
  const isIconOnly = hasIcon && !hasText
  const isStatusBadge =
    color == 'success' || color == 'warning' || color == 'error'

  if (isStatusBadge && !hasIcon) {
    throw new Error(
      '`Badge`s used for communicating status must have an icon to avoid relying on color alone.'
    )
  }

  if (!hasIcon && !hasText) {
    throw new Error(
      '`Badge` must have either `text` or an `icon` with accessible labels.'
    )
  }

  if (isIconOnly && !hasLabel) {
    throw new Error(
      'Icon-only `Badge`s require an accessible label. Either provide the `text` prop or one of: `ariaLabel`, `ariaLabelledBy`, `ariaDescribedBy`.'
    )
  }

  if (ariaLabel && ariaLabelledBy) {
    throw new Error(
      '`Badge` does not accept both `ariaLabel` and `ariaLabelledBy`. Only provide one or the other.'
    )
  }

  return (
    <span
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={classes}
    >
      {icon}
      {text && <span>{text}</span>}
    </span>
  )
}

export type { BadgeProps }
export default Badge
