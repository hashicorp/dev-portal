import { ButtonProps } from 'components/button'
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

export interface SidebarProps {
  /**
   * Optional props to send to `SidebarBackToLink` which is displayed at the top
   * of the sidebar. If this prop is omitted, `SidebarBackToLink` will not be
   * rendered.
   */
  backToLinkProps?: SidebarBackToLinkProps

  /**
   * @TODO write up description
   */
  levelButtonProps?: Pick<ButtonProps, 'text' | 'iconPosition' | 'onClick'>

  /**
   * Menu items to render in the sidebar.
   */
  menuItems: MenuItem[]

  /**
   * Whether or not the Sidebar should render the filter text input.
   */
  showFilterInput?: boolean

  /**
   * Text to be shown as the title of the sidebar.
   */
  title: string

  /**
   * @TODO this is coming from another PR
   */
  visuallyHideTitle?: boolean
}
