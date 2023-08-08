/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Components
import SidebarBackToLink from 'components/sidebar/components/sidebar-back-to-link'
// Local
import {
	OpenApiDocsMobileMenuLevels,
	OpenApiOverview,
	OpenApiSidebarContents,
	OpenApiOperations,
} from './components'
import s from './open-api-docs-view.module.css'
// Types
import type { OpenApiDocsViewProps } from './types'

/**
 * Placeholder for a revised OpenAPI docs view.
 */
function OpenApiDocsView({
	productData,
	title,
	releaseStage,
	description,
	operationGroups,
	navItems,
}: OpenApiDocsViewProps) {
	return (
		<SidebarLayout
			sidebarSlot={
				<>
					<SidebarBackToLink text="HashiCorp Cloud Platform" href="/hcp" />
					<OpenApiSidebarContents navItems={navItems} />
				</>
			}
			mobileMenuSlot={
				<OpenApiDocsMobileMenuLevels
					productData={productData}
					navItems={navItems}
				/>
			}
		>
			<div className={s.paddedContainer}>
				<OpenApiOverview
					className={s.overview}
					title={title}
					badgeText={releaseStage}
					description={description}
				/>
				<OpenApiOperations operationGroups={operationGroups} />
			</div>
		</SidebarLayout>
	)
}

export default OpenApiDocsView
