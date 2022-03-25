import classNames from 'classnames'
import { BadgeProps } from './types'
import s from './badge.module.css'

const Badge = ({
  ariaDescribedBy,
  ariaLabel,
  ariaLabelledBy,
  color = 'neutral',
  icon,
  size = 'medium',
  text,
  type = 'filled',
}: BadgeProps) => {
  const className = classNames(s.root, s[size], s[`${type}-${color}`])
  return (
    <span
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className}
    >
      {icon}
      {text && <span>{text}</span>}
    </span>
  )
}

export type { BadgeProps }
export default Badge
