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
  /** Optional { text, url } to use for the "← Back to..." link at the top of the sidebar */
  backToLink?: {
    text: string
    url: string
  }
  menuItems: MenuItem[]
  /** title to be shown as the title of the sidebar */
  title: string
}
