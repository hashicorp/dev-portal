/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductData } from 'types/products'
import {
	Flag,
	IntegrationComponent,
	Tier,
	type Integration,
} from 'lib/integrations-api-client/integration'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { type BreadcrumbLink } from 'components/breadcrumb-bar'
import { type SidebarProps } from 'components/sidebar'
import { BrandedHeaderCard } from './components/branded-header-card'
import { IntegrationsSearchProvider } from './contexts/integrations-search-context'
import SearchableIntegrationsList from './components/searchable-integrations-list'
import s from './style.module.css'

export interface ViewProps {
	allComponents: Array<IntegrationComponent>
	allFlags: Array<Flag>
	allTiers: Array<Tier>
	breadcrumbLinks: Array<BreadcrumbLink>
	integrations: Array<Integration>
	product: ProductData
	sidebarNavDataLevels: Array<SidebarProps>
}

export default function ProductIntegrationsLanding({
	allComponents,
	allFlags,
	allTiers,
	breadcrumbLinks,
	integrations,
	product,
	sidebarNavDataLevels,
}: ViewProps) {
	return (
		<IntegrationsSearchProvider
			allComponents={allComponents}
			allFlags={allFlags}
			allTiers={allTiers}
			integrations={integrations}
		>
			<SidebarSidecarLayout
				breadcrumbLinks={breadcrumbLinks}
				sidebarNavDataLevels={sidebarNavDataLevels}
			>
				<div className={s.mainArea}>
					<BrandedHeaderCard
						description={product.integrationsConfig.description}
						heading={`${product.name} Integrations`}
						productSlug={product.slug}
					/>
					<SearchableIntegrationsList className={s.searchList} />
				</div>
			</SidebarSidecarLayout>
		</IntegrationsSearchProvider>
	)
}
ProductIntegrationsLanding.contentType = 'integrations'
