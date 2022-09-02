import { ReactNode } from 'react'
import { SidebarProps } from 'components/sidebar'
import { Collection, Tutorial } from 'lib/learn-client/types'

export interface TutorialSidebarProps {
	/**
	 * Title text to show at the top of the sidebar
	 */
	title: SidebarProps['title']

	/**
	 * A "back" link to display at the top of the sidebar
	 */
	backToLinkProps: SidebarProps['backToLinkProps']

	/**
	 * Children to render in the main items area. Expects a mix of SectionTitle,
	 * SectionList, and HorizontalRule components.
	 */
	children: SidebarProps['children']

	/**
	 * Passed directly to the inner rendered `Sidebar` component.
	 */
	levelButtonProps?: SidebarProps['levelButtonProps']

	/**
	 * Passed directly to the inner rendered `Sidebar` component.
	 */
	overviewItemHref?: SidebarProps['overviewItemHref']

	/**
	 * Optional. If true, the title of the sidebar will be visually hidden.
	 */
	visuallyHideTitle?: boolean
}

export interface ListItemProps {
	href: string
	isActive?: boolean
	text: string
}

export interface TutorialListItemProps extends ListItemProps {
	tutorialId: Tutorial['id']
	collectionId: Collection['id']
}

export interface SectionListProps {
	children: ReactNode
}

export interface SectionTitleProps {
	text: string
}
