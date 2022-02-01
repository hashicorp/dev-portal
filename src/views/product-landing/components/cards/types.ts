import { ProductBrandColor } from 'components/icon-tile'
interface CardInterface {
  icon?: string
  iconBrandColor?: ProductBrandColor
  iconSvg?: string
  heading: string
  text: string
  url: string
  tags?: string[]
}

export interface CardProps {
  columns: number
  cards: CardInterface[]
}
