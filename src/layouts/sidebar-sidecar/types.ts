import { ReactElement } from 'react'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { SidebarProps } from 'components/sidebar'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'

/**
 * The following approach enables us to require the either the `headings` prop
 * OR the `sidecarSlot` prop.
 *
 * In the `PropsForTableOfContents` and `PropsForCustomSidecar` interfaces, the
 * "other" prop is marked optional with its type set to `never` so that we can
 * continue to destructure both props in the `SidebarSidecarLayout` declaration.
 */

interface BaseProps {
  breadcrumbLinks?: BreadcrumbLink[]
  children: React.ReactNode
  githubFileUrl?: string
  openConsentManager?: () => void
}

interface PropsForDefaultSidebar extends BaseProps {
  sidebarProps: SidebarProps
  sidebarSlot?: never
}

interface PropsForCustomSidebar extends BaseProps {
  sidebarProps?: never
  sidebarSlot: ReactElement
}

interface PropsForTableOfContents extends BaseProps {
  headings: TableOfContentsHeading[]
  sidecarSlot?: never
}

interface PropsForCustomSidecar extends BaseProps {
  headings?: never
  sidecarSlot: ReactElement
}

// TODO: hard to read
export type SidebarSidecarLayoutProps = (
  | PropsForDefaultSidebar
  | PropsForCustomSidebar
) &
  (PropsForTableOfContents | PropsForCustomSidecar)
