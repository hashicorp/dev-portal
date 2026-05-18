/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'

const PRODUCT_SLUGS_WITHOUT_INSTALL_PAGE: ProductSlug[] = [
	'hcp',
	'waypoint',
	'vault-radar',
]

/**
 * Returns whether or not the given product slug is installable.
 *
 * This is needed to support products that don't have install pages, such as
 * HCP products or things like well architected framework. In either case - an
 * install option doesn't really make sense since the first are managed services
 * and the latter isn't _really_ a "product" per-se(we just treat it like one for
 * the purposes of devdot)
 *
 * Either way, this is a central source of truth to add any product slugs to that
 * shouldn't have an "Install" link rendered in the UI anywhere (e.g. top nav, product landing page, etc.)
 */
export const isInstallable = (productSlug: ProductSlug): boolean => !PRODUCT_SLUGS_WITHOUT_INSTALL_PAGE.includes(productSlug)
