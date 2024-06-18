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
function OpenApiDocsPreviewViewV2({
	staticProps,
	operationProps,
	sidebarItemGroups,
}: {
	staticProps: OpenApiDocsViewProps
	operationProps: $TSFixMe
	sidebarItemGroups?: $TSFixMe
}) {
	const [shouldReload, setShouldReload] = useState<Boolean>(false)

	return (
		<>
			<div style={{ isolation: 'isolate' }}>
				{shouldReload
					? 'Reload page to see changes based on uploaded file'
					: ''}
				{operationProps && sidebarItemGroups ? (
					<OpenApiDocsViewV2
						operationProps={operationProps}
						sidebarItemGroups={sidebarItemGroups}
					/>
				) : (
					// Render an empty sidebar layout if we don't have valid props yet
					<SidebarLayout sidebarSlot="" mobileMenuSlot={null}>
						<div style={{ padding: '24px' }}>
							<pre>
								<code>{JSON.stringify({ staticProps }, null, 2)}</code>
							</pre>
						</div>
					</SidebarLayout>
				)}
			</div>
			<OpenApiPreviewInputs setStaticProps={() => setShouldReload(true)} />
		</>
	)
}

export default OpenApiDocsPreviewViewV2
