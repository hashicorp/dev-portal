/**
 * Copyright IBM Corp. 2021, 2025
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

	if (product.slug !== 'hcp' &&
		product.slug !== 'waypoint' &&
		product.slug !== 'vault-radar') {
		iconCards.push({
			icon: <IconDownload16 />,
			text: 'Install',
			url: product.slug === 'boundary'
				? `/${product.slug}/install/enterprise`
				: `/${product.slug}/install`,
		})
	}

	// Add a "Tutorials" link for all products except sentinel
	if (product.slug !== 'sentinel') {
		iconCards.push({
			icon: <IconLearn16 />,
			text: 'Tutorials',
			url: `/${product.slug}/tutorials`,
		})
	}

	// Add a "Documentation" link for all products. Most products' primary
	// docs live at /<slug>/docs. vault-radar is the only current product
	// without a "docs" basePath — it only ever had HCP-hosted docs, never a
	// separate self-hosted product, so its content lives at /<slug>/hcp-docs
	// with only a redirect standing in for /<slug>/docs. Client-side
	// next/link navigation doesn't go through next.config.js redirects
	// (those only apply to full HTTP requests) — it matches the dynamic
	// root-docs-path route directly and crashes, since "docs" isn't one of
	// vault-radar's actual rootDocsPaths. So link straight to the real path
	// whenever "docs" isn't a real basePath, instead of hardcoding by slug.
	const hasDocsBasePath = product.basePaths?.includes('docs')
	iconCards.push({
		icon: <IconDocs16 />,
		text: 'Documentation',
		url: hasDocsBasePath
			? `/${product.slug}/docs`
			: `/${product.slug}/${product.rootDocsPaths?.[0]?.path}`,
	})

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
