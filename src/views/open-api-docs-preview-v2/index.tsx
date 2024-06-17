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
import { OpenApiPreviewInputs } from 'views/open-api-docs-preview-v2/components/open-api-preview-inputs'
// Types
import type { OpenApiDocsViewProps } from 'views/open-api-docs-view-v2/types'

/**
 * Render an OpenApi docs view alongside preview inputs that allow
 * dynamic, client-side updating of the props used to render the view.
 */
function OpenApiDocsPreviewViewV2(props: $TSFixMe) {
	const { staticProps } = props
	const [apiDocsViewProps, setApiDocsViewProps] =
		useState<OpenApiDocsViewProps>()

	const usableProps = apiDocsViewProps || staticProps

	return (
		<>
			<div style={{ isolation: 'isolate' }}>
				{usableProps ? (
					<OpenApiDocsViewV2 {...usableProps} />
				) : (
					// Render an empty sidebar layout if we don't have valid props yet
					<SidebarLayout sidebarSlot="" mobileMenuSlot={null}>
						<div style={{ padding: '24px' }}>
							<pre>
								<code>
									{JSON.stringify({ usableProps, staticProps }, null, 2)}
								</code>
							</pre>
						</div>
					</SidebarLayout>
				)}
			</div>
			<OpenApiPreviewInputs setStaticProps={setApiDocsViewProps} />
		</>
	)
}

export default OpenApiDocsPreviewViewV2
