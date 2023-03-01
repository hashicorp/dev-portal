/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductData } from 'types/products'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { integrationBreadcrumbLinks } from './integration-breadcrumb-links'
import { getIntegrationUrl } from './get-integration-url'

/**
 * Build breadcrumb links for a versioned integration "readme" page.
 */
export function integrationVersionBreadcrumbLinks(
	product: ProductData,
	integration: Integration,
	activeRelease: Release,
	finalBreadcrumbSegments: boolean
): Array<BreadcrumbLink> {
	return [
		...integrationBreadcrumbLinks(product, integration, false),
		{
			title: `v${activeRelease.version}`,
			url: getIntegrationUrl(integration, activeRelease.version),
			isCurrentPage: finalBreadcrumbSegments,
		},
	]
}
