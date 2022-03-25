import { ReactElement } from 'react'

export interface BadgeProps {
  color?:
    | 'error'
    | 'highlight'
    | 'neutral-dark-mode'
    | 'neutral'
    | 'success'
    | 'warning'
  icon?: ReactElement
  size?: 'small' | 'medium' | 'large'
  text?: string
  type?: 'filled' | 'inverted' | 'outlined'
}
