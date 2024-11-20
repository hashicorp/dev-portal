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
import { getOperationGroupKeyFromPath } from 'views/open-api-docs-view/utils/get-operation-group-key-from-path'
// Schema transforms
import { schemaTransformShortenHcp } from 'views/open-api-docs-view/schema-transforms/schema-transform-shorten-hcp'
import { schemaTransformComponent } from 'views/open-api-docs-view/schema-transforms/schema-transform-component'
import { shortenProtobufAnyDescription } from 'views/open-api-docs-view/schema-transforms/shorten-protobuf-any-description'
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
	basePath: '/hcp/api-docs/identity',
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
		path: 'specs/cloud-iam',
		ref: 'main',
	},
	productContext: 'hcp',
	theme: 'hcp',
	getOperationGroupKey: getOperationGroupKeyFromPath,
	getOperationTitle(operation) {
		/**
		 * In this spec, operation IDs are formatted as
		 * `ServiceId_OperationId`. We want to display the `OperationId` part.
		 * We split the ID on `_`, then return the last part.
		 */
		const idParts = operation.operationId.split('_')
		return idParts[idParts.length - 1]
	},
	resourceLinks: [
		{
			text: 'Tutorial Library',
			href: '/tutorials/library?edition=hcp',
		},
		{
			text: 'Community',
			href: 'https://discuss.hashicorp.com/',
		},
		{
			text: 'Support',
			href: 'https://www.hashicorp.com/customer-success',
		},
	],
	schemaTransforms: [
		//  Replace "HashiCorp Cloud Platform" with "HCP" in the title
		schemaTransformShortenHcp,
		/**
		 * Shorten the description of the protobufAny schema
		 *
		 * Note: ideally this would be done at the content source,
		 * but until we've got that work done, this shortening
		 * seems necessary to ensure incremental static regeneration works
		 * for past versions of the API docs. Without this shortening,
		 * it seems the response size ends up crossing a threshold that
		 * causes the serverless function that renders the page to fail.
		 *
		 * Related task:
		 * https://app.asana.com/0/1207339219333499/1207339701271604/f
		 */
		(schema) => {
			return schemaTransformComponent(
				schema,
				'google.protobuf.Any',
				shortenProtobufAnyDescription
			)
		},
	],
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
