import { ReactNode } from 'react'
import { ProductSlug } from 'types/products'

export interface IconCard {
  icon: ReactNode
  text: string
  url: string
  productSlug: ProductSlug
}
export interface IconCardsProps {
  cards: Omit<IconCard, 'productSlug'>[]
  productSlug: ProductSlug
}
