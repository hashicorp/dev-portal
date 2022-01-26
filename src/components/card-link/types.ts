import { ReactNode } from 'react'
import { CardProps } from 'components/card'

/**
 * NOTE: "base" is excluded from `elevation` because that elevation should only
 * be used with non-interactive Cards, according to the design system.
 */
export interface CardLinkProps {
  children: ReactNode
  className?: string
  elevation?: Exclude<CardProps['elevation'], 'base'>
  href: string
}
