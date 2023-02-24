/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useState } from 'react'
import { ProductData } from 'types/products'
import { type Integration } from 'lib/integrations-api-client/integration'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { type BreadcrumbLink } from 'components/breadcrumb-bar'
import { type SidebarProps } from 'components/sidebar'
import { BrandedHeaderCard } from './components/branded-header-card'
import { IntegrationsSearchProvider } from './contexts/integrations-search-context'
import LoadingSkeleton from './components/loading-skeleton'
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
	 * -- Why a loading skeleton? --
	 *
	 * This effect is necessary when users land on the page and query parameters
	 * are in the URL. Since query parameters are only accessible client-side,
	 * filters are not applied until the first client-side render.
	 *
	 * Because this page is pre-rendered server-side based on the props from
	 * getStaticProps, a hydration mismatch will happen between the two renders.
	 * Instead of rendering the unfiltered view server-side, we render a loading
	 * skeleton until the first client-side render via `useEffect`.
	 *
	 * -- Why the setTimeout? --
	 *
	 * The purpose of using `setTimeout` to extend the loading skeleton rendering
	 * is to prevent a flash between the "loading" and "loaded" states for users
	 * with faster internet connections. Flashes have high risk for harming users,
	 * and no one wants to wait too long for a page to load.
	 *
	 * To balance these two needs we show the loading skeleton slightly longer
	 * than needed to prevent the flash, and we animate the loading skeleton to
	 * keep users engaged while it's displayed.
	 */
	const [isClientLoading, setIsClientLoading] = useState(true)
	useEffect(() => {
		setTimeout(() => {
			setIsClientLoading(false)
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
					{isClientLoading ? (
						<LoadingSkeleton />
					) : (
						<SearchableIntegrationsList className={s.searchList} />
					)}
				</div>
			</SidebarSidecarLayout>
		</IntegrationsSearchProvider>
	)
}
ProductIntegrationsLanding.contentType = 'integrations'
