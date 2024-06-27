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
import type { OpenApiDocsViewV2Props } from 'views/open-api-docs-view-v2/types'
import { BreadcrumbLink } from '@components/breadcrumb-bar'

/**
 * Render an OpenApi docs view alongside preview inputs that allow
 * dynamic, client-side updating of the props used to render the view.
 */
function OpenApiDocsPreviewViewV2({
	staticProps,
	submittedData,
	hasPreviewProps,
}: {
	staticProps: OpenApiDocsViewV2Props
	submittedData: $TSFixMe // TODO: add type here, same as submitted data
	hasPreviewProps?: boolean
}) {
	const [shouldReload, setShouldReload] = useState<boolean>(false)

	return (
		<>
			<div style={{ isolation: 'isolate' }}>
				{hasPreviewProps ? (
					<OpenApiDocsViewV2
						_devProps={staticProps}
						operationProps={staticProps.operationProps}
						sidebarItemGroups={staticProps.sidebarItemGroups}
						breadcrumbLinks={staticProps.breadcrumbLinks}
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
				defaultValues={submittedData}
				shouldReload={shouldReload}
				setStaticProps={() => setShouldReload(true)}
			/>
		</>
	)
}

export default OpenApiDocsPreviewViewV2
