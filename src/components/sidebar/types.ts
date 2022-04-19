import { ReactNode } from 'react'
import { SidebarBackToLinkProps } from './components/sidebar-back-to-link'

/**
 *
 * For reference: this is also defined in react-components/docs-sidenav:
 * https://github.com/hashicorp/react-components/blob/main/packages/docs-sidenav/types.ts
 *
 */
export interface MenuItem {
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

interface SidebarBaseProps {
  /**
   * Optional props to send to `SidebarBackToLink` which is displayed at the top
   * of the sidebar. If this prop is omitted, `SidebarBackToLink` will not be
   * rendered.
   */
  backToLinkProps?: SidebarBackToLinkProps

  /**
   * Whether or not the Sidebar should render the filter text input.
   */
  showFilterInput?: boolean

  /**
   * Text to be shown as the title of the sidebar.
   */
  title: string

  /**
   * @TODO - write description
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
      menuItems: MenuItem[]
    }

export type SidebarProps = SidebarBaseProps & SidebarContentProps
