import { ReactElement } from 'react'

export interface HeroProps {
  className?: string
  badgeText?: string
  heading: string
  description: ReactElement
}
