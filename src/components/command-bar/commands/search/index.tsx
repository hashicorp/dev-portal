/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconSearch24 } from '@hashicorp/flight-icons/svg-react/search-24'
import { CommandBarCommand } from 'components/command-bar/types'
import { getCurrentProductTag } from './helpers'
import { UnifiedSearchCommandBarDialogBody } from './unified-search/components'

type Options = Parameters<CommandBarCommand['inputProps']['placeholder']>[0]

const generatePlaceholder = (options: Options) => {
	let placeholderText

	const { commandBarState, currentProduct } = options
	const currentProductTag = getCurrentProductTag({
		currentProduct,
		currentTags: commandBarState.currentTags,
	})

	if (currentProductTag) {
		placeholderText = `Search ${
			currentProduct.slug === 'hcp' ? 'HCP' : currentProduct.name
		}`
	} else {
		placeholderText = 'Search all products'
	}

	return `${placeholderText}...`
}

const searchCommand: CommandBarCommand = {
	name: 'search',
	icon: <IconSearch24 />,
	inputProps: {
		placeholder: generatePlaceholder,
	},
	DialogBody: UnifiedSearchCommandBarDialogBody,
}

export default searchCommand
