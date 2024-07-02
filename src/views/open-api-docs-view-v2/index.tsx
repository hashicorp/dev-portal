/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Types
import type { OpenApiDocsViewV2Props } from './types'
import Link from 'next/link'

/**
 * Placeholder view component for a new OpenAPI docs setup.
 *
 * This new setup will split each operation into its own URL,
 * and render an overview page at the base URL.
 */
export default function OpenApiDocsViewV2({ _dev }: OpenApiDocsViewV2Props) {
	return (
		<SidebarLayout sidebarSlot="" mobileMenuSlot={null}>
			<div style={{ padding: '24px', border: '1px solid magenta' }}>
				<p>
					{`This is a placeholder view for a new OpenAPI docs setup. It will split each operation into its own URL, and render an overview page at the base URL.`}
				</p>
				<p>
					{`Later we'll transform the submitted OpenAPI JSON and other preview inputs into props for this page. For now, we're just reflecting them back, as shown below.`}
				</p>
				<p>{`Example operation links, to demo how "operationSlug" will be used in getServerSideProps to allow previewing of many pages:`}</p>
				<ul>
					<li>
						<a href="/open-api-docs-preview-v2">Base URL</a>
					</li>
					<li>
						<a href="/open-api-docs-preview-v2/ExampleOperationOne">
							ExampleOperationOne
						</a>
					</li>
					<li>
						<a href="/open-api-docs-preview-v2/ExampleOperationTwo">
							ExampleOperationTwo
						</a>
					</li>
					<li>
						<a href="/open-api-docs-preview-v2/ExampleOperationThree">
							ExampleOperationThree
						</a>
					</li>
				</ul>
				<pre style={{ whiteSpace: 'pre-wrap' }}>
					<code>{JSON.stringify(_dev, null, 2)}</code>
				</pre>
			</div>
		</SidebarLayout>
	)
}
