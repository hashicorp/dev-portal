import { ReactNode } from 'react'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { MenuItem } from 'components/sidebar'
import { TableOfContentsHeading } from 'components/table-of-contents'

/**
 * The following approach enables us to require the either the `headings` prop
 * OR the `sidecarChildren` prop.
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
}

interface PropsForTableOfContents extends BaseProps {
  headings: TableOfContentsHeading[]
}

interface PropsForCustomSidecar extends BaseProps {
  sidecarChildren: ReactNode
}

export type SidebarSidecarLayoutProps =
  | PropsForTableOfContents
  | PropsForCustomSidecar
