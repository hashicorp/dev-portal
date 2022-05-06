import { ReactElement } from 'react'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { SidebarProps } from 'components/sidebar'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'

/**
 * `BaseProps` represents the props that are defined for every usage of
 * `SidebarSidecarLayout`.
 */
interface BaseProps {
  breadcrumbLinks?: BreadcrumbLink[]
  children: React.ReactNode
  githubFileUrl?: string
  openConsentManager?: () => void
  sidebarNavDataLevels: SidebarProps[]
  /** @TODO determine the minimum set of props that all Sidebars should have */
  AlternateSidebar?: (props: any) => ReactElement
}

/**
 * `PropsForSidecar` defines the properties that represent `Sidecar` behavior.
 * This approach allows us to require either (not both) `headings` and
 * `sidecarSlot` since providing both of these props is not a case that this
 * component handles.
 */
type PropsForSidecar =
  | {
      headings: TableOfContentsHeading[]
      sidecarSlot?: never
    }
  | {
      headings?: never
      sidecarSlot: ReactElement
    }

/**
 * This is the final exported type, combining all types defined above into one.
 */
export type SidebarSidecarLayoutProps = BaseProps & PropsForSidecar
