/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Layout
import SidebarLayout from 'layouts/sidebar-layout'
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
	_placeholder,
}: OpenApiDocsViewProps) {
	return (
		<SidebarLayout
			sidebarSlot={<OpenApiSidebarContents operationGroups={operationGroups} />}
			mobileMenuSlot={<OpenApiDocsMobileMenuLevels productData={productData} />}
		>
			<OpenApiOverview
				className={s.overview}
				title={title}
				badgeText={releaseStage}
				description={description}
			/>
			<OpenApiOperations operationGroups={operationGroups} />
		</SidebarLayout>
	)
}

export default OpenApiDocsView
