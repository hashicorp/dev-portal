/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { productSlugsToNames } from 'lib/products'

/**
 * The Algolia index we are searching against for tutorials
 */
export const INDEX_NAME = __config.dev_dot.algolia.tutorialsIndexName

/**
 * Duration used to throttle search requests to avoid excessive network calls
 */
export const SEARCH_TIMEOUT_MS = 200

/**
 * Controls the resources filters, attribute is the name on the indexed tutorial object in Algolia
 */
export const RESOURCES = [
	{
		label: 'Video',
		attribute: 'hasVideo',
	},
	{ label: 'Interactive', attribute: 'isInteractive' },
]

/**
 * Controls the editions filters, values map to those specified on the indexed tutorial object in Algolia
 */
export const EDITIONS = [
	{ value: 'open_source', label: 'Open Source' },
	{ value: 'enterprise', label: 'Enterprise' },
	{ value: 'tfc', label: 'Terraform Cloud' },
	{ value: 'hcp', label: 'HashiCorp Cloud Platform (HCP)' },
]

/**
 * Controls the content type filters
 *
 * TODO: hide these for now, keep this /tutorials/library and not
 * like /advanced-search which kind of the direction we go if we
 * keep this filter visible.
 */
export const CONTENT_TYPES = [
	{ value: 'docs', label: 'Documentation' },
	{ value: 'tutorial', label: 'Tutorial' },
	{ value: 'integration', label: 'Integration' },
]

/**
 * Valid edition slugs for filtering tutorials by.
 */
export const VALID_EDITION_SLUGS_FOR_FILTERING = EDITIONS.map(
	(edition) => edition.value
)

/**
 * Valid product slugs for filtering tutorials by. Currently, excludes hcp and sentinel and
 * only has our core products.
 */
export const VALID_PRODUCT_SLUGS_FOR_FILTERING = Object.keys(
	productSlugsToNames
).filter((slug) => !['hcp', 'sentinel'].includes(slug))
