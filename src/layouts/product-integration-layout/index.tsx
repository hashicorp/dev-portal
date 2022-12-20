import HashiHead from '@hashicorp/react-head'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release, ReleaseComponent } from 'lib/integrations-api-client/release'
import { ProductData } from 'types/products'
import Header from './components/header'

interface ProductIntegrationLayoutProps {
	currentProduct: ProductData
	integration: Integration
	activeRelease: Release
	breadcrumbLinks: BreadcrumbLink[]
	// When the version is changed on a page using this layout,
	// this function should calculate the new URL that we
	// should be redirected to.
	getVersionChangedURL: (version: string) => string
	children: React.ReactNode
}

/**
 * This is a layout component that manages the SidebarSidecarLayout of an integration
 * page. This layout is coupled to the URL structure, and assumes this integration
 * page is rendering in the `/{product}/integrations/{integration}` context.
 */
export default function ProductIntegrationLayout({
	currentProduct,
	integration,
	activeRelease,
	breadcrumbLinks,
	getVersionChangedURL,
	children,
}: ProductIntegrationLayoutProps) {
	// Determine if we're on the lastest version, as that will slightly adjust the URLs
	const onLatestVersion = integration.versions[0] === activeRelease.version

	// Components that have READMEs or Variable Groups get a page
	const componentsWithPages: Array<ReleaseComponent> =
		activeRelease.components.filter((rc: ReleaseComponent) => {
			return rc.readme || rc.variable_groups.length
		})

	// Calculate the Sidebar
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(currentProduct.name),
		generateProductLandingSidebarNavData(currentProduct),
		// TODO: Generate the Integrations Landing Page Level
		{
			backToLinkProps: {
				text: `${currentProduct.name} Integrations`,
				href: `/${currentProduct.slug}/integrations`,
			},
			levelButtonProps: {
				levelUpButtonText: `${currentProduct.name} Home`,
				levelDownButtonText: 'Previous',
			},
			showFilterInput: false,
			title: integration.name,
			menuItems: [
				{
					title: 'Overview',
					fullPath: onLatestVersion
						? `/${currentProduct.slug}/integrations/${integration.slug}`
						: `/${currentProduct.slug}/integrations/${integration.slug}/${activeRelease.version}`,
				},
				componentsWithPages.length
					? {
							title: 'Components',
							isOpen: true,
							routes: componentsWithPages.map((rc: ReleaseComponent) => {
								return {
									title: rc.component.name,
									fullPath: onLatestVersion
										? `/${currentProduct.slug}/integrations/${integration.slug}/latest/components/${rc.component.slug}`
										: `/${currentProduct.slug}/integrations/${integration.slug}/${activeRelease.version}/components/${rc.component.slug}`,
								}
							}),
					  }
					: undefined,
			],
		},
	]

	return (
		<SidebarSidecarLayout
			// TODO: see if we can fix the navDataLevels type
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			sidebarNavDataLevels={sidebarNavDataLevels}
			breadcrumbLinks={breadcrumbLinks}
			sidecarSlot={<></>}
		>
			{!onLatestVersion && (
				<HashiHead>
					<meta name="robots" content="noindex, nofollow" />
				</HashiHead>
			)}
			<Header
				integration={integration}
				activeRelease={activeRelease}
				getVersionChangedURL={getVersionChangedURL}
				onInstallClicked={() => {
					console.log('TODO, probably remove this')
				}}
			/>

			{children}
		</SidebarSidecarLayout>
	)
}
