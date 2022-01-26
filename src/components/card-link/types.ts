import { ReactNode } from 'react'
import { CardProps } from 'components/card'

interface CardLinkProps {
  children: ReactNode
  className?: string
  elevation?: Exclude<CardProps['elevation'], 'base'>
  href: string
}

export type { CardLinkProps }
