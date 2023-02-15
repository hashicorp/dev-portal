/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { SUPPORTED_ICONS } from 'content/supported-icons'
import { IconCardLinkGridListCard } from 'components/icon-card-link-grid-list'

interface IconCardGridBlockCard {
	iconName: keyof typeof SUPPORTED_ICONS
	text: IconCardLinkGridListCard['text']
	url: IconCardLinkGridListCard['url']
}

interface IconCardGridBlockProps {
	cards: IconCardGridBlockCard[]
	productSlug: ProductSlug
}

export type { IconCardGridBlockCard, IconCardGridBlockProps }
