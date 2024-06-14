/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { useState } from 'react'
// View
import OpenApiDocsViewV2 from 'views/open-api-docs-view-v2'
// Components
import SidebarLayout from 'layouts/sidebar-layout'
import { OpenApiPreviewInputs } from 'views/open-api-docs-preview/components/open-api-preview-inputs'
// Types
import type { OpenApiDocsViewProps } from 'views/open-api-docs-view/types'

/**
 * Render an OpenApi docs view alongside preview inputs that allow
 * dynamic, client-side updating of the props used to render the view.
 */
function OpenApiDocsPreviewViewV2() {
	const [apiDocsViewProps, setApiDocsViewProps] =
		useState<OpenApiDocsViewProps>()

	return (
		<>
			<div style={{ isolation: 'isolate' }}>
				{apiDocsViewProps ? (
					<OpenApiDocsViewV2 {...apiDocsViewProps} />
				) : (
					// Render an empty sidebar layout if we don't have valid props yet
					<SidebarLayout sidebarSlot="" mobileMenuSlot={null}>
						<div style={{ padding: '24px' }} />
					</SidebarLayout>
				)}
			</div>
			<OpenApiPreviewInputs setStaticProps={setApiDocsViewProps} />
		</>
	)
}

export default OpenApiDocsPreviewViewV2
