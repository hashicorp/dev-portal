import { EnrichedNavItem, SidebarProps } from 'components/sidebar/types'

export function generateWafCollectionSidebar(
	wafData: { name: string; slug: string },
	sidebarSections: EnrichedNavItem[]
): SidebarProps {
	return {
		title: wafData.name,
		levelButtonProps: {
			levelUpButtonText: `Main Menu`,
			levelDownButtonText: 'Previous',
		},
		overviewItemHref: `/${wafData.slug}`,
		menuItems: sidebarSections,
		showFilterInput: false,
	}
}
