/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// View
import OpenApiDocsViewV2 from 'views/open-api-docs-view-v2'
import {
	generateStaticPaths,
	generateStaticPropsVersioned,
} from 'views/open-api-docs-view-v2/server'
// Utils
import { getOperationGroupKeyFromPath } from 'views/open-api-docs-view-v2/utils/get-operation-group-key-from-path'
// Schema transforms
import { schemaTransformShortenHcp } from 'views/open-api-docs-view-v2/schema-transforms/schema-transform-shorten-hcp'
import { schemaTransformComponent } from 'views/open-api-docs-view-v2/schema-transforms/schema-transform-component'
import { shortenProtobufAnyDescription } from 'views/open-api-docs-view-v2/schema-transforms/shorten-protobuf-any-description'
import { schemaRemoveOperation } from 'views/open-api-docs-view-v2/schema-transforms/schema-remove-operation'
// Types
import type {
	GetStaticPaths,
	GetStaticProps,
	GetStaticPropsContext,
} from 'next'
import type {
	OpenApiDocsV2Params,
	OpenApiDocsViewV2Props,
	OpenApiDocsViewV2Config,
} from 'views/open-api-docs-view-v2/types'

/**
 * Configure this OpenAPI spec page, specifying the source,
 * and additional configuration that doesn't fit in the schema itself.
 */
const PAGE_CONFIG: OpenApiDocsViewV2Config = {
	backToLink: {
		href: '/hcp',
		text: 'HashiCorp Cloud Platform',
	},
	basePath: '/hcp/api-docs/rbac',
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
		path: 'specs/cloud-resource-manager',
		ref: 'main',
	},
	productContext: 'hcp',
	theme: 'hcp',
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
	getOperationTitle(operation) {
		/**
		 * In this spec, operation IDs are formatted as
		 * `ServiceId_OperationId`. We want to display the `OperationId` part.
		 * We split the ID on `_`, then return the last part.
		 */
		const idParts = operation.operationId.split('_')
		return idParts[idParts.length - 1]
	},
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
		/**
		 * Hide the org-create API endpoint. Ideally we'd find a way to do
		 * this in the content source, but for now, we're making this change
		 * in order to ship these docs. Note that this is not guaranteed to work
		 * for future versions of this same API, eg if the date-based version
		 * in the path changes. This is one reason why making finding a way to
		 * hide operations using flags at the content source would be preferable.
		 */
		(schema) => {
			return schemaRemoveOperation(
				schema,
				'/resource-manager/2019-12-10/projects',
				'post'
			)
		},
	],
}

/**
 * Get static paths, using the configured `schemaSource`.
 */
export const getStaticPaths: GetStaticPaths<OpenApiDocsV2Params> = async () => {
	return await generateStaticPaths({
		schemaSource: PAGE_CONFIG.schemaSource,
		schemaTransforms: PAGE_CONFIG.schemaTransforms,
	})
}

/**
 * Get static paths, using the configured `schemaSource`.
 */
export const getStaticProps: GetStaticProps<
	OpenApiDocsViewV2Props,
	OpenApiDocsV2Params
> = async ({ params }: GetStaticPropsContext<OpenApiDocsV2Params>) => {
	return await generateStaticPropsVersioned(PAGE_CONFIG, params?.page)
}

export default OpenApiDocsViewV2
