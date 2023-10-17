/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { Integration } from 'lib/integrations-api-client/integration'
import { fetchAllProductIntegrations } from 'lib/integrations-api-client/integration'

type FetchAllIntegrationsResult = Integration[]

/**
 * Fetch a flat array of all integrations across all provided product slugs.
 *
 * TODO: consider other approaches to fetching metadata for many integrations.
 * in typical use cases, such as getStaticPaths, we don't need the complete
 * integration data here, and are instead looking mostly for a list of
 * integration slugs, component slugs, and version data.
 */
export async function fetchAllIntegrations(
	productSlugs: Omit<ProductSlug, 'waypoint'>[]
): Promise<FetchAllIntegrationsResult> {
	return (
		await Promise.all(productSlugs.map(fetchAllProductIntegrations))
	).flat()
}

export type { FetchAllIntegrationsResult }
