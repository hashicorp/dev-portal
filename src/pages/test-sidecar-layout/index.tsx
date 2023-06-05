import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DevHeightAdjustablePlaceholder from 'components/dev-height-adjustable-placeholder'
import Head from 'next/head'

/**
 * Stub data from `/packer`, just to get the layout to render without errors.
 */
const SIDEBAR_NAV_DATA_LEVELS = [
	{
		levelButtonProps: {
			levelDownButtonText: 'Packer Home',
		},
		menuItems: [
			{
				leadingIconName: 'home',
				title: 'HashiCorp Developer',
				href: '/',
			},
			{
				divider: true,
			},
			{
				heading: 'Products',
			},
			{
				leadingIconName: 'hcp',
				title: 'HashiCorp Cloud Platform',
				href: '/hcp',
			},
			{
				leadingIconName: 'terraform',
				title: 'Terraform',
				href: '/terraform',
			},
			{
				leadingIconName: 'packer',
				title: 'Packer',
				href: '/packer',
			},
			{
				leadingIconName: 'consul',
				title: 'Consul',
				href: '/consul',
			},
			{
				leadingIconName: 'vault',
				title: 'Vault',
				href: '/vault',
			},
			{
				leadingIconName: 'boundary',
				title: 'Boundary',
				href: '/boundary',
			},
			{
				leadingIconName: 'nomad',
				title: 'Nomad',
				href: '/nomad',
			},
			{
				leadingIconName: 'waypoint',
				title: 'Waypoint',
				href: '/waypoint',
			},
			{
				leadingIconName: 'vagrant',
				title: 'Vagrant',
				href: '/vagrant',
			},
		],
		showFilterInput: false,
		title: 'Main Menu',
	},
	{
		levelButtonProps: {
			levelUpButtonText: 'Main Menu',
			levelDownButtonText: 'Previous',
		},
		menuItems: [
			{
				title: 'Packer',
				fullPath: '/packer',
				theme: 'packer',
			},
			{
				title: 'Documentation',
				fullPath: '/packer/docs',
			},
			{
				title: 'Guides',
				fullPath: '/packer/guides',
			},
			{
				title: 'Plugins',
				fullPath: '/packer/plugins',
			},
			{
				title: 'Tutorials',
				fullPath: '/packer/tutorials',
			},
			{
				title: 'Install',
				fullPath: '/packer/downloads',
			},
		],
		showFilterInput: false,
		title: 'Packer',
		visuallyHideTitle: true,
	},
] as $TSFixMe

export default function TestSidecarLayout() {
	return (
		<SidebarSidecarLayout
			sidebarNavDataLevels={SIDEBAR_NAV_DATA_LEVELS}
			sidecarTopSlot={
				<DevHeightAdjustablePlaceholder
					name="sidecarTopSlot"
					defaultCssHeight="321px" // arbitrary, could be anything
				/>
			}
			sidecarSlot={
				<DevHeightAdjustablePlaceholder
					name="sidecarSlot"
					defaultCssHeight="200vh" // arbitrary, could be anything
				/>
			}
		>
			{/* noindex just in case we accidentally ship this to prod */}
			<Head>
				<meta name="robots" content="noindex, nofollow" key="robots" />
			</Head>
			<DevHeightAdjustablePlaceholder
				name="Main content"
				defaultCssHeight="200vh"
			/>
		</SidebarSidecarLayout>
	)
}
