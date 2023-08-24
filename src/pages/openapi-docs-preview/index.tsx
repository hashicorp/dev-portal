/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { useState } from 'react'
// View
import OpenApiDocsView from 'views/open-api-docs-view'
// Components
import SidebarLayout from 'layouts/sidebar-layout'
import { OpenApiPreviewInputs } from 'views/open-api-docs-preview/components/open-api-preview-inputs'
// Types
import type { OpenApiDocsViewProps } from 'views/open-api-docs-view/types'

/**
 * Render an OpenApi docs view alongside preview inputs that allow
 * dynamic, client-side updating of the props used to render the view.
 */
function OpenApiDocsPreviewView() {
	const [staticProps, setStaticProps] = useState<OpenApiDocsViewProps>()

	return (
		<>
			<div style={{ isolation: 'isolate' }}>
				{staticProps ? (
					<OpenApiDocsView {...staticProps} />
				) : (
					// Render an empty sidebar layout if we don't have valid props yet
					<SidebarLayout sidebarSlot="" mobileMenuSlot={null}>
						<div style={{ padding: '24px' }} />
					</SidebarLayout>
				)}
			</div>
			<OpenApiPreviewInputs setStaticProps={setStaticProps} />
		</>
	)
}

export default OpenApiDocsPreviewView
