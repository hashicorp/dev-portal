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
// Schema transforms
import { schemaTransformShortenHcp } from 'views/open-api-docs-view/schema-transforms/schema-transform-shorten-hcp'
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

/**
 * Configure this OpenAPI spec page, specifying the source,
 * and additional configuration that doesn't fit in the schema itself.
 */
const PAGE_CONFIG: OpenApiDocsViewConfig = {
	backToLink: {
		href: '/hcp',
		text: 'HashiCorp Cloud Platform',
	},
	basePath: '/hcp/api-docs/webhook',
	breadcrumbLinksPrefix: [
		{
			title: 'Developer',
			url: '/',
		},
		{
			title: 'HashiCorp Cloud Platform',
			url: '/hcp',
		},
	],
	schemaSource: {
		owner: 'hashicorp',
		repo: 'hcp-specs',
		path: 'specs/cloud-webhook',
		ref: 'main',
	},
	productContext: 'hcp',
	theme: 'hcp',
	statusIndicatorConfig: {
		pageUrl: 'https://status.hashicorp.com',
		endpointUrl:
			'https://status.hashicorp.com/api/v2/components/0q55nwmxngkc.json',
	},
	resourceLinks: [
		{
			text: 'Community',
			href: 'https://discuss.hashicorp.com/',
		},
		{
			text: 'Support',
			href: 'https://www.hashicorp.com/customer-success',
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
	schemaTransforms: [schemaTransformShortenHcp],
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
