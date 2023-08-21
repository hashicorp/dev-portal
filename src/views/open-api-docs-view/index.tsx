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
import { DescriptionMdx } from './components/open-api-overview/components/description-mdx'

/**
 * Placeholder for a revised OpenAPI docs view.
 */
function OpenApiDocsView({
	productData,
	title,
	releaseStage,
	descriptionMdx,
	operationGroups,
	navItems,
	navResourceItems,
	breadcrumbLinks,
	statusIndicatorConfig,
}: OpenApiDocsViewProps) {
	return (
		<SidebarLayout
			sidebarSlot={
				<>
					<SidebarBackToLink text="HashiCorp Cloud Platform" href="/hcp" />
					<OpenApiSidebarContents
						navItems={navItems}
						navResourceItems={navResourceItems}
					/>
				</>
			}
			mobileMenuSlot={
				<OpenApiDocsMobileMenuLevels
					productData={productData}
					navItems={navItems}
					navResourceItems={navResourceItems}
				/>
			}
		>
			<div className={s.paddedContainer}>
				<div className={s.spaceBreadcrumbsOverview}>
					<BreadcrumbBar links={breadcrumbLinks} />
					<OpenApiOverview
						title={title}
						badgeText={releaseStage}
						statusIndicatorConfig={statusIndicatorConfig}
						contentSlot={
							descriptionMdx ? (
								<DescriptionMdx mdxRemoteProps={descriptionMdx} />
							) : null
						}
					/>
				</div>
				<div className={s.operationsSection}>
					<h2 className={s.operationsHeading}>Operations</h2>
					<OpenApiOperations operationGroups={operationGroups} />
				</div>
			</div>
		</SidebarLayout>
	)
}

export default OpenApiDocsView
