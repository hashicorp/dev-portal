import { ProductOption } from 'lib/learn-client/types'

export type CardBadgeOption = ProductOption | 'video' | 'interactive'

export interface CardBadgesProps {
  badges: CardBadgeOption[]
}
