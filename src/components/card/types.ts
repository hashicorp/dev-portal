import { ReactNode } from 'react'

export interface CardProps {
  /** The elements to render within the card body. */
  children: ReactNode
  /** A string of one or more classnames attached to the card body element. */
  className?: string
  elevation?: 'base' | 'mid' | 'high'
}
