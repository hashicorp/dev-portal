/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductData } from 'types/products'
import { type Integration } from 'lib/integrations-api-client/integration'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { type BreadcrumbLink } from 'components/breadcrumb-bar'
import { type SidebarProps } from 'components/sidebar'
import { BrandedHeaderCard } from './components/branded-header-card'
import { IntegrationsSearchProvider } from './contexts/integrations-search-context'
import SearchableIntegrationsList from './components/searchable-integrations-list'
import s from './style.module.css'

export interface ViewProps {
	hasQueryParams?: boolean
	integrations: Array<Integration>
	sidebarNavDataLevels: Array<SidebarProps>
	breadcrumbLinks: Array<BreadcrumbLink>
	product: ProductData
}

export default function ProductIntegrationsLanding({
	hasQueryParams,
	integrations,
	sidebarNavDataLevels,
	breadcrumbLinks,
	product,
}: ViewProps) {
	return (
		<IntegrationsSearchProvider integrations={integrations}>
			<SidebarSidecarLayout
				sidebarNavDataLevels={sidebarNavDataLevels}
				breadcrumbLinks={breadcrumbLinks}
			>
				<div className={s.mainArea}>
					<BrandedHeaderCard
						productSlug={product.slug}
						heading={`${product.name} Integrations`}
						description={product.integrationsConfig.description}
					/>
					<SearchableIntegrationsList
						className={s.searchList}
						hasQueryParams={hasQueryParams}
					/>
				</div>
			</SidebarSidecarLayout>
		</IntegrationsSearchProvider>
	)
}
ProductIntegrationsLanding.contentType = 'integrations'
