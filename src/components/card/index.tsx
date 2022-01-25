import { FC } from 'react'
import classNames from 'classnames'
import { CardProps } from './types'
import s from './card.module.css'

const Card: FC<CardProps> = ({ children, className, elevation = 'low' }) => {
  const classes = classNames(`hds-surface-${elevation}`, s.root, className)

  return <div className={classes}>{children}</div>
}

export type { CardProps }
export default Card
