import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  elevation?: 'base' | 'low' | 'mid' | 'high'
}

export type { CardProps }
