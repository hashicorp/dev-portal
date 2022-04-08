import { ReactNode } from 'react'

export interface TutorialSidebarProps {
  /** A "back" link to display at the top of the sidebar */
  backToLink: { href: string; text: string }
  /** Children to render in the main items area. Expects a mix of SectionTitle, SectionList, and HorizontalRule components. */
  children: ReactNode
  /** An id to point to a visible element that acts as the title of the sidebar */
  ariaLabelledBy?: string
}

export interface ListItemProps {
  href: string
  isActive?: boolean
  /** Optional. If true, this link will show an external icon and will open in a new tab. If false, this link will not show an icon, and will not open in a new tab. If omitted, then isExternal will be set to true if href is an absolute URL, or will be set to false otherwise. */
  isExternal?: boolean
  text: string
}

export interface SectionListProps {
  items: ListItemProps[]
}

export interface SectionTitleProps {
  text: string
  as?: 'h1' | 'h2'
  id?: string
  visuallyHidden?: boolean
}
