/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { useState } from 'react'
// View
import OpenApiDocsView from 'views/open-api-docs-view'
// Types
import type { OpenApiDocsViewProps } from 'views/open-api-docs-view/types'
/**
 * TODO: live preview components, find a way to clean up this page file
 * to better differentiate things.
 */
import { OpenApiPreviewInputs } from 'views/open-api-docs-preview/components/open-api-preview-inputs'
import SidebarLayout from 'layouts/sidebar-layout'

/**
 * TODO: write description for this type,
 * actually use it in other pages
 */
// interface PageConfig {
// 	productSlug: ProductSlug
// 	basePath: string
// 	navResourceItems: OpenApiNavItem[]
// 	githubSourceDirectory: {
// 		owner: string
// 		repo: string
// 		path: string
// 		ref: string
// 	}
// 	statusIndicatorConfig: {
// 		pageUrl: string
// 		endpointUrl: string
// 	}
// }

/**
 * TODO: clean up this implementation
 */
function OpenApiDocsPreviewView() {
	const [staticProps, setStaticProps] = useState<{
		props: OpenApiDocsViewProps
	} | null>(null)

	return (
		<>
			{/* <pre
				style={{
					maxHeight: '200px',
					overflow: 'auto',
					border: '1px solid magenta',
				}}
			>
				<code>{JSON.stringify(staticProps, null, 2)}</code>
			</pre> */}
			<div style={{ isolation: 'isolate' }}>
				{staticProps && 'props' in staticProps ? (
					<OpenApiDocsView {...staticProps.props} />
				) : (
					<SidebarLayout sidebarSlot="" mobileMenuSlot={null}>
						<div style={{ padding: '24px' }} />
					</SidebarLayout>
				)}
			</div>
			<OpenApiPreviewInputs
				staticProps={staticProps}
				setStaticProps={setStaticProps}
			/>
		</>
	)
}

export default OpenApiDocsPreviewView
