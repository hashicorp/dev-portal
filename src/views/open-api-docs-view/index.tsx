/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Components
import BreadcrumbBar from 'components/breadcrumb-bar'
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
	breadcrumbLinks,
	statusIndicatorConfig,
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
				<pre style={{ border: '1px solid magenta' }}>
					<code>{JSON.stringify({ statusIndicatorConfig }, null, 2)}</code>
				</pre>
				<div className={s.spaceBreadcrumbsOverview}>
					<BreadcrumbBar links={breadcrumbLinks} />
					<OpenApiOverview
						title={title}
						badgeText={releaseStage}
						description={description}
					/>
				</div>
				<OpenApiOperations operationGroups={operationGroups} />
			</div>
		</SidebarLayout>
	)
}

export default OpenApiDocsView
