/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useState } from 'react'
import { ProductData } from 'types/products'
import { type Integration } from 'lib/integrations-api-client/integration'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { type BreadcrumbLink } from 'components/breadcrumb-bar'
import { LoadingSkeletonProvider } from 'components/loading-skeleton'
import { type SidebarProps } from 'components/sidebar'
import { BrandedHeaderCard } from './components/branded-header-card'
import { IntegrationsSearchProvider } from './contexts/integrations-search-context'
import SearchableIntegrationsList from './components/searchable-integrations-list'
import s from './style.module.css'

export interface ViewProps {
	integrations: Array<Integration>
	sidebarNavDataLevels: Array<SidebarProps>
	breadcrumbLinks: Array<BreadcrumbLink>
	product: ProductData
}

export default function ProductIntegrationsLanding({
	integrations,
	sidebarNavDataLevels,
	breadcrumbLinks,
	product,
}: ViewProps) {
	/**
	 * Show a loading spinner until 1500ms after the `useEffect` runs to prevent a
	 * hydration error.
	 */
	const [isLoadingClient, setIsLoadingClient] = useState(true)
	useEffect(() => {
		setTimeout(() => {
			// TODO uncommonent before merging
			// setIsLoadingClient(false)
		}, 1500)
	}, [])

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
					<LoadingSkeletonProvider isLoading={isLoadingClient}>
						<SearchableIntegrationsList className={s.searchList} />
					</LoadingSkeletonProvider>
				</div>
			</SidebarSidecarLayout>
		</IntegrationsSearchProvider>
	)
}
ProductIntegrationsLanding.contentType = 'integrations'
