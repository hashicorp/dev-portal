/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { AutocompleteCollection, BaseItem } from '@algolia/autocomplete-core'

/**
 * If any collection has hit 'items', return true. This is used to help
 * determine whether the 'no results' state should show
 */

export function hasResults(collections: AutocompleteCollection<BaseItem>[]) {
	let itemsExist = false
	for (const collection of collections) {
		if (collection.items.length > 0) {
			itemsExist = true
			break
		}
	}
	return itemsExist
}
