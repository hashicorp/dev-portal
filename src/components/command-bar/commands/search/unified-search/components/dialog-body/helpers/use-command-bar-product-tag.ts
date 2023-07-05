/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useMemo } from 'react'
import { useCommandBar } from 'components/command-bar'
import { useCurrentProduct } from 'contexts'
import { getCurrentProductTag } from '../../../../helpers'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import { ProductSlug } from 'types/products'
import { isProductSlug } from 'lib/products'

type CommandBarProductTag = {
	id: ProductSlug
	text: string
}

/**
 * Set and un-set the command-bar-level product filtering tag.
 *
 * TODO: consider refactoring this.
 *
 * We've had feedback from design at least that the "product tag" interface
 * doesn't feel right within the search modal. This raises a few questions:
 *
 * - Is this genuinely a command-bar-wide setting, or are "product tag" filters
 *   something we could apply to the "Search" command only for now? (Note:
 *   I'm not even sure other "commands" (ie "settings") are implemented yet...
 *   managing the "tags" at the command bar level feels like it may have
 *   been a premature abstraction based on relatively speculative use cases).
 *
 * - In the context of search, specifically auto-filtering to a given product
 *   when in that product context, Would typing-based filters, such as
 *   `product:<productSlug>`, be preferable to the "product tag" approach?
 */
export function useCommandBarProductTag(): CommandBarProductTag | null {
	const currentProduct = useCurrentProduct()
	const { addTag, currentTags, removeTag } = useCommandBar()

	/**
	 * Create callback for setting up this command's state.
	 */
	const setUpCommandState = useCallback(() => {
		if (currentProduct) {
			addTag({
				id: currentProduct.slug,
				text: currentProduct.slug === 'hcp' ? 'HCP' : currentProduct.name,
			})
		}
	}, [addTag, currentProduct])

	/**
	 * Create callback for cleaning up this command's state.
	 */
	const cleanUpCommandState = useCallback(() => {
		if (currentProduct) {
			removeTag(currentProduct.slug)
		}
	}, [currentProduct, removeTag])

	/**
	 * Leveraging the set up + clean up hook exposed by CommandBarDialog.
	 */
	useSetUpAndCleanUpCommandState(setUpCommandState, cleanUpCommandState)

	/**
	 * Get the CommandBarTag object for the current product if it's present.
	 */
	const currentProductTag = useMemo(
		() =>
			getCurrentProductTag({
				currentProduct,
				currentTags,
			}),
		[currentProduct, currentTags]
	)

	if (isProductSlug(currentProductTag?.id)) {
		return {
			id: currentProductTag.id,
			text: currentProductTag.text,
		}
	} else {
		return null
	}
}
