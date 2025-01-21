/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { EnrichedNavItem, SidebarProps } from 'components/sidebar/types'
import addBrandedOverviewSidebarItem from 'lib/docs/add-branded-overview-sidebar-item'

export function generateValidatedPatternsCollectionSidebar(
	validatedPatternsData: { name: string; slug: string },
	sidebarSections: EnrichedNavItem[]
): SidebarProps {
	return {
		title: validatedPatternsData.name,
		levelButtonProps: {
			levelUpButtonText: `Main Menu`,
			levelDownButtonText: 'Previous',
		},
		/* We always visually hide the title, as we've added in a
			"highlight" item that would make showing the title redundant. */
		visuallyHideTitle: true,
		menuItems: addBrandedOverviewSidebarItem(sidebarSections, {
			title: validatedPatternsData.name,
			fullPath: `/${validatedPatternsData.slug}`,
			theme: 'hcp',
		}) as $TSFixMe,
		showFilterInput: false,
	}
}
