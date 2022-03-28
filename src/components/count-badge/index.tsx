import classNames from 'classnames'
import Badge from 'components/badge'
import { CountBadgeProps } from './types'
import s from './count-badge.module.css'

const CountBadge = ({
  color = 'neutral',
  size = 'medium',
  text,
  type = 'filled',
}: CountBadgeProps) => {
  const classes = classNames(s.root, s[size])

  return (
    <Badge
      className={classes}
      color={color}
      size={size}
      text={text}
      type={type}
    />
  )
}

export type { CountBadgeProps }
export default CountBadge
