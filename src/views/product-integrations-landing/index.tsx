import s from './style.module.css'
import SearchableIntegrationsList from './components/searchable-integrations-list'
import { IntegrationsSearchProvider } from './contexts/integrations-search-context'
import { ProductData } from 'types/products'
import { Integration } from 'lib/integrations-api-client/integration'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'

interface ViewProps {
	product: ProductData
	integrations: Array<Integration>
}

import {
	generateTopLevelSidebarNavData,
	generateProductLandingSidebarNavData,
} from 'components/sidebar/helpers'

export default function ProductIntegrationsLanding({
	product,
	integrations,
}: ViewProps) {
	const breadcrumbLinks = [
		{
			title: 'Developer',
			url: '/',
			isCurrentPage: false,
		},
		{
			title: product.name,
			url: `/${product.slug}`,
			isCurrentPage: false,
		},
		{
			title: 'Integrations',
			url: `/${product.slug}/integrations`,
			isCurrentPage: true,
		},
	]
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
		{
			backToLinkProps: {
				text: `${product.name} Home`,
				href: `/${product.slug}`,
			},
			levelButtonProps: {
				levelUpButtonText: `${product.name} Home`,
				levelDownButtonText: 'Previous',
			},
			menuItems: [
				{
					title: 'Library',
					href: `/${product.slug}/integrations`,
					isActive: true,
				},
			],
			showFilterInput: false,
			title: `${product.name} Integrations`,
		},
	]
	return (
		<IntegrationsSearchProvider integrations={integrations}>
			<SidebarSidecarLayout
				// @ts-expect-error - ignore type error caused by menuItems
				sidebarNavDataLevels={sidebarNavDataLevels}
				breadcrumbLinks={breadcrumbLinks}
				sidecarSlot={<></>}
			>
				<div className={s.mainArea}>
					<SearchableIntegrationsList className={s.searchList} />
				</div>
			</SidebarSidecarLayout>
		</IntegrationsSearchProvider>
	)
}
