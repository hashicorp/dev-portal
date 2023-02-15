/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Children, ReactElement } from 'react'
import {
	DropdownDisclosureProps,
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureSeparatorItem,
} from 'components/dropdown-disclosure'

/**
 * Determines if the given `child` is one of the exported subcomponents of
 * `DropdownDisclosure`.
 */
const childIsAValidAContentComponent = (child: ReactElement) => {
	return (
		child.type === DropdownDisclosureButtonItem ||
		child.type === DropdownDisclosureDescriptionItem ||
		child.type === DropdownDisclosureLabelItem ||
		child.type === DropdownDisclosureLinkItem ||
		child.type === DropdownDisclosureSeparatorItem
	)
}

/**
 * Validates that the `children` passed to `DropdownDisclosure` are each one of
 * the exported subcomponents.
 */
const validateDropdownDisclosureChildren = (
	children: DropdownDisclosureProps['children']
) => {
	// validate number of children is correct
	const childCount = Children.count(children)
	if (childCount === 0) {
		throw new Error(
			'DropdownDisclosure expects at least 1 child but was given zero.'
		)
	}

	// validate the children are the correct components
	Children.forEach(children, (child: ReactElement) => {
		if (!childIsAValidAContentComponent) {
			throw new Error(
				'DropdownDisclosure children must be one of: DropdownDisclosureButtonItem, DropdownDisclosureDescriptionItem, DropdownDisclosureLabelItem, DropdownDisclosureLinkItem, DropdownDisclosureSeparatorItem'
			)
		}
	})
}

export { validateDropdownDisclosureChildren }
