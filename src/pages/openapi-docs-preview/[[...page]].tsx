/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { useState } from 'react'
// View
import { ApiDocsParams } from 'views/api-docs-view/server'
import { fetchCloudApiVersionData } from 'views/api-docs-view/utils'
// Revised view
import OpenApiDocsView from 'views/open-api-docs-view'
import {
	getStaticPaths as getOpenApiDocsStaticPaths,
	getStaticProps as getOpenApiDocsStaticProps,
} from 'views/open-api-docs-view/server'
// Types
import type { ApiDocsViewProps } from 'views/api-docs-view/types'
import type {
	GetStaticPaths,
	GetStaticProps,
	GetStaticPropsContext,
} from 'next'
import type { OpenAPIV3 } from 'openapi-types'
import type {
	OpenApiDocsViewProps,
	OpenApiNavItem,
} from 'views/open-api-docs-view/types'
import { ProductSlug } from 'types/products'

/**
 * TODO: write description for this type
 */
interface PageConfig {
	productSlug: ProductSlug
	basePath: string
	navResourceItems: OpenApiNavItem[]
	githubSourceDirectory: {
		owner: string
		repo: string
		path: string
		ref: string
	}
	statusIndicatorConfig: {
		pageUrl: string
		endpointUrl: string
	}
}

const PAGE_CONFIG: PageConfig = {
	/**
	 * The product slug is used to fetch product data for the layout.
	 */
	productSlug: 'hcp',
	/**
	 * The baseUrl is used to generate
	 * breadcrumb links, sidebar nav levels, and version switcher links.
	 */
	basePath: '/hcp/api-docs/vault-secrets',
	/**
	 * We source version data from a directory in the `hcp-specs` repo.
	 * See `fetchCloudApiVersionData` for details.
	 */
	githubSourceDirectory: {
		owner: 'hashicorp',
		repo: 'hcp-specs',
		path: 'specs/cloud-vault-secrets',
		ref: 'main',
	},
	/**
	 * Data to power the status page indicator in the header area.
	 */
	statusIndicatorConfig: {
		pageUrl: 'https://status.hashicorp.com',
		endpointUrl:
			'https://status.hashicorp.com/api/v2/components/hk67zg2j2rkd.json',
	},
	/**
	 * Resource items are shown in the sidebar
	 */
	navResourceItems: [
		{
			title: 'Tutorial Library',
			href: '/tutorials/library?product=vault&edition=hcp',
		},
		{
			title: 'Certifications',
			href: '/certifications/security-automation',
		},
		{
			title: 'Community',
			href: 'https://discuss.hashicorp.com/',
		},
		{
			title: 'Support',
			href: 'https://www.hashicorp.com/customer-success',
		},
	],
}

/**
 * TODO: actually implement this

 */
function OpenApiDocsPreviewView(props: OpenApiDocsViewProps) {
	const [staticProps, setStaticProps] = useState<OpenApiDocsViewProps>()

	return (
		<>
			<OpenApiPreviewInputs
				staticProps={staticProps}
				setStaticProps={setStaticProps}
			/>
			<OpenApiDocsView {...props} />
		</>
	)
}

function OpenApiPreviewInputs({ staticProps, setStaticProps }: $TSFixMe) {
	const [inputData, setInputData] = useState({
		testTextInput: 'This is some text',
	})

	async function fetchStaticProps() {
		console.log('fetching static props...')
		const result = await fetch('/api/get-openapi-view-props', {
			method: 'POST',
			body: JSON.stringify(inputData),
		})
		const resultData = await result.json()
		setStaticProps(resultData)
	}

	return (
		<div style={{ border: '1px solid magenta' }}>
			<p>
				Controls to upload spec files will go here. Page will be rendered below
			</p>
			<p>
				<label htmlFor="testTextInput">Test text input</label>
				<br />
				<input
					id="testTextInput"
					type="text"
					onChange={(e) =>
						setInputData((p) => ({ ...p, testTextInput: e.target.value }))
					}
					value={inputData.testTextInput}
				/>
			</p>
			<p>
				<button onClick={() => fetchStaticProps()}>
					Get some static props
				</button>
			</p>
			<pre>
				<code>{JSON.stringify(staticProps, null, 2)}</code>
			</pre>
		</div>
	)
}

/**
 * Get static paths, using `versionData` fetched from GitHub.
 */
export const getStaticPaths: GetStaticPaths<ApiDocsParams> = async (ctx) => {
	return await getOpenApiDocsStaticPaths(ctx)
}

/**
 * Get static props, using `versionData` fetched from GitHub.
 *
 * We need all version data for the version selector,
 * and of course we need specific data for the current version.
 */
export const getStaticProps: GetStaticProps<
	ApiDocsViewProps | OpenApiDocsViewProps,
	ApiDocsParams
> = async ({ params }: GetStaticPropsContext<ApiDocsParams>) => {
	// Fetch all version data, based on remote `stable` & `preview` subfolders
	const versionData = await fetchCloudApiVersionData(
		PAGE_CONFIG.githubSourceDirectory
	)
	// If we can't find any version data at all, render a 404 page.
	if (!versionData) {
		return { notFound: true }
	}

	return await getOpenApiDocsStaticProps({
		basePath: PAGE_CONFIG.basePath,
		context: { params },
		productSlug: PAGE_CONFIG.productSlug,
		statusIndicatorConfig: PAGE_CONFIG.statusIndicatorConfig,
		navResourceItems: PAGE_CONFIG.navResourceItems,
		// Handle rename of `targetFile` to `sourceFile` for new template
		versionData: versionData.map(({ targetFile, ...rest }) => {
			return { ...rest, sourceFile: targetFile }
		}),
		/**
		 * Massage the schema data a little bit, replacing
		 * "HashiCorp Cloud Platform" in the title with "HCP".
		 */
		massageSchemaForClient: (schemaData: OpenAPIV3.Document) => {
			// Replace "HashiCorp Cloud Platform" with "HCP" in the title
			const massagedTitle = schemaData.info.title.replace(
				'HashiCorp Cloud Platform',
				'HCP'
			)
			// Return the schema data with the revised title
			const massagedInfo = { ...schemaData.info, title: massagedTitle }
			return { ...schemaData, info: massagedInfo }
		},
	})
}

export default OpenApiDocsPreviewView
