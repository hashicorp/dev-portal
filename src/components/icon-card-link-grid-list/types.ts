/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { CardsGridListProps } from 'components/cards-grid-list'
import { IconCardLinkProps } from 'components/icon-card-link'
import { ProductSlug } from 'types/products'

export type IconCardLinkGridListCard = Pick<
	IconCardLinkProps,
	'icon' | 'productSlug' | 'text' | 'url'
>

export interface IconCardLinkGridListProps
	extends Pick<CardsGridListProps, 'gridGap' | 'fixedColumns'> {
	cards: IconCardLinkGridListCard[]
	productSlug?: ProductSlug
}
