/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { getIconCards } from '../get-icon-cards'
import { ProductData } from 'types/products'

function findDocsCard(product: Partial<ProductData>) {
	const cards = getIconCards(product as ProductData)
	return cards.find((card) => card.text === 'Documentation')
}

describe('getIconCards - Documentation link', () => {
	it('links to /<slug>/docs for products with a "docs" basePath', () => {
		const docsCard = findDocsCard({
			slug: 'boundary',
			basePaths: ['docs', 'api-docs', 'downloads', 'hcp-docs'],
			rootDocsPaths: [{ iconName: 'docs', name: 'Documentation', path: 'docs' }],
		})
		expect(docsCard.url).toBe('/boundary/docs')
	})

	it('links straight to the real root docs path for products without a "docs" basePath', () => {
		const docsCard = findDocsCard({
			slug: 'vault-radar',
			basePaths: ['hcp-docs'],
			rootDocsPaths: [
				{ iconName: 'docs', name: 'HCP Vault Radar', path: 'hcp-docs' },
			],
		})
		expect(docsCard.url).toBe('/vault-radar/hcp-docs')
	})
})
