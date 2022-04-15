import { SidebarBackToLinkProps } from './components/sidebar-back-to-link'

/**
 * Interfaces for each nav item in their raw form, before any enrichment or
 * filtering via the filter input
 */

interface DividerNavItem {
  divider: boolean
}

interface HeadingNavItem {
  heading: string
}

interface BaseNavItem {
  hidden?: boolean
  title: string
}

interface SubmenuNavItem extends BaseNavItem {
  routes: SidebarNavItem[]
}

interface InternalLinkNavItem extends BaseNavItem {
  path: string
}

interface ExternalLinkNavItem extends BaseNavItem {
  href: string
}

// LinkNavItems should have either path or href, but not both
interface LinkNavItem extends InternalLinkNavItem, ExternalLinkNavItem {}

// The main, general nav item type
type SidebarNavItem =
  | DividerNavItem
  | HeadingNavItem
  | SubmenuNavItem
  | LinkNavItem

/**
 * Interfaces for enriched nav items without filtering via the filter input
 */

interface EnrichedSubmenuNavItem extends SubmenuNavItem {
  id: string
  routes: EnrichedNavItem[]
}

interface EnrichedLinkNavItem extends LinkNavItem {
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
  /* Temporary solution to allow rendering of unlinked headings, as in designs */
  heading?: string
}

interface SidebarProps {
  /**
   * Optional props to send to `SidebarBackToLink` which is displayed at the top
   * of the sidebar. If this prop is omitted, `SidebarBackToLink` will not be
   * rendered.
   */
  backToLinkProps?: SidebarBackToLinkProps

  /**
   * Menu items to render in the sidebar.
   */
  menuItems: EnrichedNavItem[]

  /**
   * Whether or not the Sidebar should render the filter text input.
   */
  showFilterInput?: boolean

  /**
   * Text to be shown as the title of the sidebar.
   */
  title: string
}

export type {
  EnrichedLinkNavItem,
  EnrichedNavItem,
  EnrichedSubmenuNavItem,
  LinkNavItemWithMetaData,
  MenuItem,
  NavItemWithMetaData,
  SidebarProps,
  SubmenuNavItemWithMetaData,
}
