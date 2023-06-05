/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'

/**
 * Generates the top-level website nav data for rendering in `Sidebar` as the
 * top-level of the mobile navigation experience.
 */
export const generateTopLevelSidebarNavData = (productName: string) => {
	const levelButtonProps = {
		levelDownButtonText: `${productName} Home`,
	}
	const showFilterInput = false
	const title = 'Main Menu'

	return {
		levelButtonProps,
		menuItems: generateTopLevelSubNavItems(),
		showFilterInput,
		title,
	}
}
