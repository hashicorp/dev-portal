import { ProductBrandColor } from 'components/icon-tile/types'
export interface CardInterface {
  icon?: string
  iconBrandColor?: ProductBrandColor
  heading: string
  text: string
  url: string
  tags?: string[]
}

export interface CardProps {
  columns: number
  cards: CardInterface[]
}
