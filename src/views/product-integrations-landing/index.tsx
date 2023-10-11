/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import SearchableIntegrationsList from './components/searchable-integrations-list'
import { IntegrationsSearchProvider } from './contexts/integrations-search-context'
import { type Integration } from 'lib/integrations-api-client/integration'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { type SidebarProps } from 'components/sidebar'
import { type BreadcrumbLink } from 'components/breadcrumb-bar'
import { ProductData } from 'types/products'
import { BrandedHeaderCard } from './components/branded-header-card'
import s from './style.module.css'

export interface ViewProps {
	alertSlot?: ReactNode
	integrations: Array<Integration>
	sidebarNavDataLevels: Array<SidebarProps>
	breadcrumbLinks: Array<BreadcrumbLink>
	product: ProductData
}

export default function ProductIntegrationsLanding({
	alertSlot,
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
				{alertSlot ? alertSlot : null}
				<div className={s.mainArea}>
					<BrandedHeaderCard
						productSlug={product.slug}
						heading={`${product.name} Integrations`}
						description={product.integrationsConfig.description}
					/>
					<SearchableIntegrationsList className={s.searchList} />
				</div>
			</SidebarSidecarLayout>
		</IntegrationsSearchProvider>
	)
}
