/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// View
import OpenApiDocsView from 'views/open-api-docs-view'
import {
	generateStaticPaths,
	generateStaticPropsVersioned,
} from 'views/open-api-docs-view/server'
// Utils
import { isDeployPreview } from 'lib/env-checks'
// Types
import type {
	GetStaticPaths,
	GetStaticProps,
	GetStaticPropsContext,
} from 'next'
import type {
	OpenApiDocsParams,
	OpenApiDocsViewProps,
	OpenApiDocsViewConfig,
} from 'views/open-api-docs-view/types'
import type { ApiDocsVersionData } from 'lib/api-docs/types'

/**
 * The product slug is used to fetch product data for the layout.
 */
const PRODUCT_SLUG = 'boundary'

/**
 * The baseUrl is used to generate
 * breadcrumb links, sidebar nav levels, and version switcher links.
 */
const BASE_PATH = '/boundary/api-docs'

/**
 * The path to read from when running local preview in the context
 * of the `hashicorp/boundary` repository.
 */
const TARGET_LOCAL_FILE = '../../internal/gen/controller.swagger.json'

/**
 * Version data is hard-coded for now. In the future, we could fetch
 * version data from elsewhere, as we do for `/hcp/api-docs/packer`.
 */
function getVersionData(): ApiDocsVersionData[] {
	const sourceFile = isDeployPreview(PRODUCT_SLUG)
		? TARGET_LOCAL_FILE
		: {
				owner: 'hashicorp',
				repo: 'boundary',
				path: 'internal/gen/controller.swagger.json',
				ref: 'stable-website',
		  }
	return [
		{
			/**
			 * Note this is a `versionId` placeholder. Since it isn't date-based,
			 * currently we won't render a dedicated versioned URL for it.
			 *
			 * In the future, we could support version formats other than date-based.
			 * That might better align with versioned API docs for Boundary.
			 */
			versionId: 'latest',
			sourceFile,
		},
	]
}

/**
 * Configure this OpenAPI spec page, specifying the source,
 * and additional configuration that doesn't fit in the schema itself.
 */
const PAGE_CONFIG: OpenApiDocsViewConfig = {
	basePath: BASE_PATH,
	breadcrumbLinksPrefix: [
		{
			title: 'Developer',
			url: '/',
		},
		{
			title: 'Boundary',
			url: '/boundary',
		},
	],
	getOperationTitle(operation) {
		/**
		 * In this spec, operation IDs are formatted as
		 * `ServiceId_OperationId`. We want to display the `OperationId` part.
		 * We split the ID on `_`, then return the last part.
		 */
		const idParts = operation.operationId.split('_')
		return idParts[idParts.length - 1]
	},
	schemaSource: getVersionData(),
	productContext: PRODUCT_SLUG,
}

/**
 * Get static paths, using the configured `schemaSource`.
 */
export const getStaticPaths: GetStaticPaths<OpenApiDocsParams> = async () => {
	return await generateStaticPaths({
		schemaSource: PAGE_CONFIG.schemaSource,
		schemaTransforms: PAGE_CONFIG.schemaTransforms,
	})
}

/**
 * Get static paths, using the configured `schemaSource`.
 */
export const getStaticProps: GetStaticProps<
	OpenApiDocsViewProps,
	OpenApiDocsParams
> = async ({ params }: GetStaticPropsContext<OpenApiDocsParams>) => {
	return await generateStaticPropsVersioned(PAGE_CONFIG, params?.page)
}

export default OpenApiDocsView
