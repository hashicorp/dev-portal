/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductData } from 'types/products'
import {
	CommandBarContextState,
	CommandBarTag,
} from 'components/command-bar/types'

interface GetCurrentProductTagArguments {
	currentProduct: ProductData
	currentTags: CommandBarContextState['currentTags']
}

const getCurrentProductTag = ({
	currentProduct,
	currentTags,
}: GetCurrentProductTagArguments) => {
	return currentProduct
		? currentTags.find((tag: CommandBarTag) => tag.id === currentProduct.slug)
		: undefined
}

export { getCurrentProductTag }
