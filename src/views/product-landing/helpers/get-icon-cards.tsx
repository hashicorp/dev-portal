/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { ProductData } from 'types/products'
import { getIsEnabledProductIntegrations } from 'lib/integrations/get-is-enabled-product-integrations'

/**
 * The order of these items is meaningful, should match the top navigation items
 * We should refactor to drive this via global config https://app.asana.com/0/1204807665183200/1205002760871766/f
 */

export function getIconCards(product: ProductData) {
	const iconCards = []

	if (product.slug !== 'hcp') {
		iconCards.push({
			icon: <IconDownload16 />,
			text: 'Install',
			url: `/${product.slug}/install`,
		})
	}

	iconCards.push(
		...[
			{
				icon: <IconLearn16 />,
				text: 'Tutorials',
				url: `/${product.slug}/tutorials`,
			},
			{
				icon: <IconDocs16 />,
				text: 'Documentation',
				url: `/${product.slug}/docs`,
			},
		]
	)

	// Add Integrations card if it's enabled for this product
	if (getIsEnabledProductIntegrations(product.slug)) {
		iconCards.push({
			icon: <IconPipeline16 />,
			text: 'Integrations',
			url: `/${product.slug}/integrations`,
		})
	}

	return iconCards
}
