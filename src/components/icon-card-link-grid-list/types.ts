import { CardsGridListProps } from 'components/cards-grid-list'
import { IconCardLinkProps } from 'components/icon-card-link'
import { ProductSlug } from 'types/products'

export type IconCard = Pick<
	IconCardLinkProps,
	'icon' | 'productSlug' | 'text' | 'url'
>

export interface IconCardLinkGridListProps
	extends Pick<CardsGridListProps, 'gridGap' | 'fixedColumns'> {
	cards: IconCard[]
	productSlug?: ProductSlug
}
