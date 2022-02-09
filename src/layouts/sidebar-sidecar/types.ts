import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { MenuItem } from 'components/sidebar'
import { TableOfContentsHeading } from 'components/table-of-contents'

export interface SidebarSidecarLayoutProps {
  backToLink?: {
    text: string
    url: string
  }
  breadcrumbLinks?: BreadcrumbLink[]
  children: React.ReactNode
  githubFileUrl?: string
  headings: TableOfContentsHeading[]
  navData: MenuItem[]
  openConsentManager?: () => void
  productName: string
}
