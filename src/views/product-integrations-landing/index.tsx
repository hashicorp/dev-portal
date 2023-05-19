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
	IntegrationType,
} from 'lib/integrations-api-client/integration'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { type BreadcrumbLink } from 'components/breadcrumb-bar'
import { type SidebarProps } from 'components/sidebar'
import { BrandedHeaderCard } from './components/branded-header-card'
import { IntegrationsSearchProvider } from './contexts/integrations-search-context'
import SearchableIntegrationsList from './components/searchable-integrations-list'
import s from './style.module.css'

export interface ViewProps {
	allComponents: IntegrationComponent[]
	allFlags: Flag[]
	allTiers: Tier[]
	allTypes: IntegrationType[]
	breadcrumbLinks: BreadcrumbLink[]
	integrations: Integration[]
	product: ProductData
	sidebarNavDataLevels: SidebarProps[]
}

export default function ProductIntegrationsLanding({
	allComponents,
	allFlags,
	allTiers,
	allTypes,
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
			allTypes={allTypes}
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
