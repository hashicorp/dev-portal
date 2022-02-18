import { ReactNode } from 'react'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { MenuItem, SidebarProps } from 'components/sidebar'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'

/**
 * The following approach enables us to require the either the `headings` prop
 * OR the `sidecarChildren` prop.
 *
 * In the `PropsForTableOfContents` and `PropsForCustomSidecar` interfaces, the
 * "other" prop is marked optional with its type set to `never` so that we can
 * continue to destructure both props in the `SidebarSidecarLayout` declaration.
 */

interface BaseProps {
  backToLink?: {
    text: string
    url: string
  }
  breadcrumbLinks?: BreadcrumbLink[]
  children: React.ReactNode
  githubFileUrl?: string
  navData: MenuItem[]
  openConsentManager?: () => void
  productName: string
  showFilterInput?: boolean
  versionSwitcherOptions?: SidebarProps['versionSwitcherOptions']
}

interface PropsForTableOfContents extends BaseProps {
  headings: TableOfContentsHeading[]
  sidecarChildren?: never
}

interface PropsForCustomSidecar extends BaseProps {
  headings?: never
  sidecarChildren: ReactNode
}

export type SidebarSidecarLayoutProps =
  | PropsForTableOfContents
  | PropsForCustomSidecar
