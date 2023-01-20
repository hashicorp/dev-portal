import { ReactElement } from 'react'
import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { SidebarProps } from 'components/sidebar'
import { SidebarBaseProps } from 'components/sidebar/types'

/**
 * `BaseProps` represents the props that are defined for every usage of
 * `SidebarSidecarLayout`.
 */
interface BaseProps {
	breadcrumbLinks?: BreadcrumbLink[]
	children: React.ReactNode
	githubFileUrl?: string
	sidebarNavDataLevels: SidebarProps[]
	/**
	 * Optional component to replace the default sidebar content.
	 *
	 * This component will only be rendered for sidebarNavDataLevels where
	 * `menuItems` are undefined. Apart from menuItems, we provide the
	 * `AlternateSidebar` with all the same SidebarProps as we'd provide to the
	 * default Sidebar component.
	 *
	 * We also add on a prop to indicate whether we're rendering AlternateSidebar
	 * within the mobile menu. This allows consumers to conditionally render
	 * certain content.
	 */
	AlternateSidebar?: (
		props: SidebarBaseProps & { isMobileMenuRendered?: boolean }
	) => ReactElement
	versions?: VersionSelectItem[]
	showScrollProgress?: boolean
	mainWidth?: 'wide' | 'narrow'
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
			sidecarSlot: ReactElement | null
	  }

/**
 * This is the final exported type, combining all types defined above into one.
 */
export type SidebarSidecarLayoutProps = BaseProps & PropsForSidecar
