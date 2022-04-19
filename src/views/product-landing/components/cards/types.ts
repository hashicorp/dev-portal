import { ProductBrandColor } from 'components/icon-tile/types'
import { TagIconKey } from './tag-icon-dict'
import { IconKey } from './icon-dict'
export interface CardInterface {
  icon?: IconKey
  iconBrandColor?: ProductBrandColor
  heading: string
  text: string
  url: string
  tags?: TagIconKey[]
}

export interface CardProps {
  columns: number
  cards: CardInterface[]
}
