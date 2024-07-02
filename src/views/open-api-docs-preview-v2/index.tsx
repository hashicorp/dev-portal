/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Components
import {
	OpenApiPreviewInputs,
	OpenApiPreviewV2InputValues,
} from 'views/open-api-docs-preview-v2/components/open-api-preview-inputs'
// Types
import type { OpenApiDocsViewV2Props } from 'views/open-api-docs-view-v2/types'
import OpenApiDocsViewV2 from 'views/open-api-docs-view-v2'
import Head from 'next/head'

export interface OpenApiDocsPreviewV2Props {
	staticProps?: OpenApiDocsViewV2Props
	previewData?: OpenApiPreviewV2InputValues
	hasStaticProps: boolean
}

/**
 * Render an OpenAPI docs view alongside preview inputs.
 *
 * Preview inputs allow users to upload form data, which includes a JSON spec,
 * and then reload the page to see OpenAPI docs views rendered with that data.
 *
 * Under the hood, we're using an `/api` route to receive the form data, assign
 * it a unique ID, stash it in a temporary file, and then return the unique ID
 * to the client, where it's then stored in a cookie. On subsequent requests,
 * our `getServerSideProps` for the dynamic preview routes reads the unique ID
 * from the cookie, fetches the temporary file, transforms the spec JSON and
 * related form data into static props, and then returns those static props so
 * that the appropriate OpenAPI view can be rendered.
 */
function OpenApiDocsPreviewViewV2({
	staticProps,
	previewData,
	hasStaticProps,
}: OpenApiDocsPreviewV2Props) {
	return (
		<>
			<div style={{ isolation: 'isolate' }}>
				{hasStaticProps ? (
					<OpenApiDocsViewV2 _dev={staticProps._dev} />
				) : (
					<>
						<Head>
							<title>OpenAPI Preview Tool | HashiCorp Developer</title>
						</Head>
						<SidebarLayout sidebarSlot="" mobileMenuSlot={null}>
							<div style={{ padding: '24px', maxWidth: '35em' }}>
								<h1>OpenAPI Preview Tool</h1>
								<p>
									{`Please use the input form on this page to upload your spec. After submitting the form, the page should reload and display a preview.`}
								</p>
							</div>
						</SidebarLayout>
					</>
				)}
			</div>
			<OpenApiPreviewInputs
				defaultCollapsed={hasStaticProps}
				defaultValues={previewData}
			/>
		</>
	)
}

export default OpenApiDocsPreviewViewV2
