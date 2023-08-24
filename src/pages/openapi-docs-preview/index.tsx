/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { useState } from 'react'
// View
import OpenApiDocsView from 'views/open-api-docs-view'
// Types
import type {
	OpenApiDocsViewProps,
	OpenApiNavItem,
} from 'views/open-api-docs-view/types'
import { ProductSlug } from 'types/products'
/**
 * TODO: live preview components, find a way to clean up this page file
 * to better differentiate things.
 */
import { OpenApiPreviewInputs } from 'views/open-api-docs-preview/components/open-api-preview-inputs'

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
			<OpenApiPreviewInputs
				staticProps={staticProps}
				setStaticProps={setStaticProps}
			/>
			{/* <pre
				style={{
					maxHeight: '200px',
					overflow: 'auto',
					border: '1px solid magenta',
				}}
			>
				<code>{JSON.stringify(staticProps, null, 2)}</code>
			</pre> */}
			{staticProps && 'props' in staticProps ? (
				<OpenApiDocsView {...staticProps.props} />
			) : null}
		</>
	)
}

export default OpenApiDocsPreviewView
