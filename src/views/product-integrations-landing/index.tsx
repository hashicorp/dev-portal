import s from './style.module.css'
import SearchableIntegrationsList from './components/searchable-integrations-list'
import { IntegrationsSearchProvider } from './contexts/integrations-search-context'
import { type Integration } from 'lib/integrations-api-client/integration'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { type SidebarProps } from 'components/sidebar'
import { type BreadcrumbLink } from 'components/breadcrumb-bar'
import { Product } from 'types/products'
import { BrandedHeaderCard } from './components/branded-header-card'

export interface ViewProps {
	integrations: Array<Integration>
	sidebarNavDataLevels: Array<SidebarProps>
	breadcrumbLinks: Array<BreadcrumbLink>
	/**
	 * Passes partial product data, only what's needed for the view.
	 *
	 * Note: this prop cannot be named `product` unless it contains complete
	 * `Product` data, as in `_app.tsx`, we pass any prop named `product`
	 * to `CurrentProductProvider`. If we were to pass full product data
	 * in a prop named `product`, this would affect top navigation as well.
	 */
	productData: Pick<Product, 'slug' | 'name'>
}

export default function ProductIntegrationsLanding({
	integrations,
	sidebarNavDataLevels,
	breadcrumbLinks,
	productData,
}: ViewProps) {
	return (
		<IntegrationsSearchProvider integrations={integrations}>
			<SidebarSidecarLayout
				sidebarNavDataLevels={sidebarNavDataLevels}
				breadcrumbLinks={breadcrumbLinks}
				sidecarSlot={<></>}
			>
				<div className={s.mainArea}>
					<BrandedHeaderCard
						productSlug={productData.slug}
						heading={`${productData.name} Integrations`}
						description={`A curated collection of official, partner, and community ${productData.name} Integrations.`}
					/>
					<SearchableIntegrationsList className={s.searchList} />
				</div>
			</SidebarSidecarLayout>
		</IntegrationsSearchProvider>
	)
}
