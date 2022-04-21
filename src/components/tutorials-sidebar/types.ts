import { SidebarProps } from 'components/sidebar'

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

  levelButtonProps?: SidebarProps['levelButtonProps']

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

export interface SectionListProps {
  items: ListItemProps[]
}

export interface SectionTitleProps {
  text: string
}
