/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductData } from 'types/products'
import { Integration } from 'lib/integrations-api-client/integration'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { getIntegrationUrl } from './get-integration-url'

/**
 * Build breadcrumb links for an integration "readme" page.
 */
export function integrationBreadcrumbLinks(
	product: ProductData,
	integration: Integration,
	finalBreadcrumbSegments: boolean
): Array<BreadcrumbLink> {
	return [
		{
			title: 'Developer',
			url: '/',
		},
		{
			title: product.name,
			url: `/${product.slug}`,
		},
		{
			title: 'Integrations',
			url: `/${product.slug}/integrations`,
		},
		{
			title: integration.name,
			url: getIntegrationUrl(integration),
			isCurrentPage: finalBreadcrumbSegments,
		},
	]
}
