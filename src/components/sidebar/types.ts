import { ReactElement, ReactNode } from 'react'
import { SidebarBackToLinkProps } from './components/sidebar-back-to-link'
import { SidebarMobileControlsProps } from './components/sidebar-mobile-controls'
import { SidebarNavMenuItemBadgeProps } from './components/sidebar-nav-menu-item/types'

/**
 * Interfaces for each nav item in their raw form, before any enrichment or
 * filtering via the filter input. They are based off of some of the types
 * defined in `mktg-content-workflows/shared/types.ts`.
 *
 * ref: https://github.com/hashicorp/mktg-content-workflows/blob/main/shared/types.ts
 */

interface DividerNavItem {
	divider: boolean
}

interface HeadingNavItem {
	heading: string
}

interface BaseNavItem {
	badge?: SidebarNavMenuItemBadgeProps
	hidden?: boolean
	title: string
}

interface RawSubmenuNavItem extends BaseNavItem {
	routes: RawSidebarNavItem[]
}

interface RawInternalLinkNavItem extends BaseNavItem {
	path: string
}

interface RawExternalLinkNavItem extends BaseNavItem {
	href: string
}

// LinkNavItems should have either path or href, but not both
interface RawLinkNavItem
	extends RawInternalLinkNavItem,
		RawExternalLinkNavItem {}

// The main, general nav item type
type RawSidebarNavItem =
	| DividerNavItem
	| HeadingNavItem
	| RawSubmenuNavItem
	| RawLinkNavItem

/**
 * Interfaces for enriched nav items without filtering via the filter input
 */

interface EnrichedSubmenuNavItem extends RawSubmenuNavItem {
	id: string
	routes: EnrichedNavItem[]
}

interface EnrichedLinkNavItem extends RawLinkNavItem {
	fullPath: string
	isActive: boolean
	id: string
}

type EnrichedNavItem =
	| DividerNavItem
	| HeadingNavItem
	| EnrichedSubmenuNavItem
	| EnrichedLinkNavItem

/**
 * Interfaces for nav items that have had meta data added to them by Sidebar
 */
interface SubmenuNavItemWithMetaData extends EnrichedSubmenuNavItem {
	hasActiveChild: boolean
	routes: NavItemWithMetaData[]
}

interface LinkNavItemWithMetaData extends EnrichedLinkNavItem {
	isActive: boolean
}

type NavItemWithMetaData =
	| DividerNavItem
	| HeadingNavItem
	| SubmenuNavItemWithMetaData
	| LinkNavItemWithMetaData

/**
 * Interfaces for nav items that have been filtered via the filter input
 */
interface FilteredSubmenuNavItem extends EnrichedSubmenuNavItem {
	hasChildrenMatchingFilter: boolean
	routes: FilteredNavItem[]
}

interface FilteredLinkNavItem extends EnrichedLinkNavItem {
	matchesFilter: boolean
}

type FilteredNavItem = FilteredSubmenuNavItem | FilteredLinkNavItem

/**
 *
 * For reference: this is also defined in react-components/docs-sidenav:
 * https://github.com/hashicorp/react-components/blob/main/packages/docs-sidenav/types.ts
 *
 */
interface MenuItem {
	divider?: boolean
	fullPath?: string
	hasActiveChild?: boolean
	hasChildrenMatchingFilter?: boolean
	href?: string
	id?: string
	isActive?: boolean
	matchesFilter?: boolean
	path?: string
	routes?: MenuItem[]
	title?: string
	heading?: string
	isOpen?: boolean
	/**
	 * Optional icon to display at right of the menu item.
	 * Note that if this menu item is an external link,
	 * the `trailingIcon` will be ignored and an external link
	 * icon will be shown instead.
	 */
	trailingIcon?: ReactElement
	badge?: SidebarNavMenuItemBadgeProps
}

interface SidebarBaseProps {
	/**
	 * Optional props to send to `SidebarBackToLink` which is displayed at the top
	 * of the sidebar. If this prop is omitted, `SidebarBackToLink` will not be
	 * rendered.
	 */
	backToLinkProps?: SidebarBackToLinkProps

	/**
	 * Props to pass to `SidebarMobileControls`. See the referenced interface for
	 * full details.
	 */
	levelButtonProps?: SidebarMobileControlsProps

	/**
	 * Optional href for the Overview menu item that shows at the top of the
	 * Sidebar <nav>. Sidebar will only show this menu item if this prop is
	 * provided.
	 */
	overviewItemHref?: string

	/**
	 * Whether or not the Sidebar should render the filter text input.
	 */
	showFilterInput?: boolean

	/**
	 * Text to be shown as the title of the sidebar.
	 */
	title: string

	/**
	 * Optional. If true, the title of the sidebar will be visually hidden using
	 * the `.g-screen-reader-only` global CSS helper class.
	 */
	visuallyHideTitle?: boolean
}

/**
 * `SidebarContentProps` defines the properties that represent what content is
 * rendered inside of `Sidebar` below the consistent "header" section used in
 * all instances of `Sidebar`.
 *
 * This approach allows us to require either (not both) `children` and
 * `menuItems` since providing both of these props is not a case that this
 * component handles.
 *
 * TODO: we may decide to remove `menuItems` from instances of `Sidebar` that
 * used that prop before the `children` prop was introduced. For now, we will
 * support either prop.
 */
type SidebarContentProps =
	| {
			children: ReactNode
			menuItems?: never
	  }
	| {
			children?: never
			menuItems: EnrichedNavItem[]
	  }

type SidebarProps = SidebarBaseProps & SidebarContentProps

export type {
	EnrichedLinkNavItem,
	EnrichedNavItem,
	EnrichedSubmenuNavItem,
	FilteredNavItem,
	LinkNavItemWithMetaData,
	MenuItem,
	NavItemWithMetaData,
	SidebarProps,
	SubmenuNavItemWithMetaData,
}
