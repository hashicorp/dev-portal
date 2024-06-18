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
	const [shouldReload, setShouldReload] = useState<boolean>(false)

	return (
		<>
			<div style={{ isolation: 'isolate' }}>
				{sidebarItemGroups ? (
					<OpenApiDocsViewV2
						_devProps={staticProps}
						operationProps={operationProps}
						sidebarItemGroups={sidebarItemGroups}
					/>
				) : (
					// Render an empty sidebar layout if we don't have valid props yet
					<SidebarLayout sidebarSlot="" mobileMenuSlot={null}>
						<div style={{ padding: '24px' }}>
							<p
								style={{ border: '1px solid magenta' }}
							>{`No OpenAPI spec loaded. Use the input form on this page, which manifests visually as a purple tray at right edge of screen, to upload an OpenAPI spec, then reload the page.`}</p>
						</div>
					</SidebarLayout>
				)}
			</div>
			<OpenApiPreviewInputs
				shouldReload={shouldReload}
				setStaticProps={() => setShouldReload(true)}
			/>
		</>
	)
}

export default OpenApiDocsPreviewViewV2
