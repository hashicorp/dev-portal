import { CardProps } from 'components/card'

interface CardLinkProps {
  className?: string
  elevation: Exclude<CardProps['elevation'], 'base'>
  href: string
}

export type { CardLinkProps }
