import type { ProductSlug } from 'types/products'

export type CardBadgeOption = ProductSlug | 'video' | 'interactive'

export interface CardBadgesProps {
  badges: CardBadgeOption[]
}
