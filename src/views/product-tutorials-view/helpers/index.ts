/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	Collection as ClientCollection,
	ProductOption,
} from 'lib/learn-client/types'

/**
 * This function is an interim solution for filtering content from the /onboarding dir
 * to render on the frontend - esp in the product sitemaps and featured products options
 *
 * This function also filters collections that don't have the product as the main theme
 */

export function filterCollections(
	collections: ClientCollection[],
	theme: ProductOption
) {
	return collections.filter(
		(c: ClientCollection) => c.theme === theme && !c.slug.includes('onboarding')
	)
}
