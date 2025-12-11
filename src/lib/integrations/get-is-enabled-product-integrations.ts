/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

export function getIsEnabledProductIntegrations(productSlug: ProductSlug) {
	return __config.dev_dot.product_slugs_with_integrations.includes(productSlug)
}
