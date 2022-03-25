import classNames from 'classnames'
import { BadgeProps } from './types'
import s from './badge.module.css'

const Badge = ({
  color = 'neutral',
  icon,
  size = 'medium',
  text,
  type = 'filled',
}: BadgeProps) => {
  const className = classNames(s.root, s[size], s[`${type}-${color}`])
  return (
    <span className={className}>
      {icon}
      {text && <span>{text}</span>}
    </span>
  )
}

export type { BadgeProps }
export default Badge
