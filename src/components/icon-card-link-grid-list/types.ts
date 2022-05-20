import { IconCardLinkProps } from 'components/icon-card-link'
import { ProductSlug } from 'types/products'

export type IconCard = Pick<IconCardLinkProps, 'icon' | 'text' | 'url'>

export interface IconCardLinkGridListProps {
  cards: IconCard[]
  productSlug: ProductSlug
}
