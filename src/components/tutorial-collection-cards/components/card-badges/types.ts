import type { ProductSlug } from 'types/products'

export type CardBadgeOption = ProductOption | 'video' | 'interactive'

export interface CardBadgesProps {
  badges: CardBadgeOption[]
}
