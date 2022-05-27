import { IconCardLinkProps } from 'components/icon-card-link'
import { ProductSlug } from 'types/products'

export interface IconCard
  extends Pick<IconCardLinkProps, 'icon' | 'text' | 'url'> {
  productSlug?: IconCardLinkProps['productSlug']
}

export interface IconCardLinkGridListProps {
  cards: IconCard[]
  productSlug?: ProductSlug
}
