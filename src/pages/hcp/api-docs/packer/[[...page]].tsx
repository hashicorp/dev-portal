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
// Schema transforms
import { schemaTransformShortenHcp } from 'views/open-api-docs-view-v2/schema-transforms/schema-transform-shorten-hcp'
import { schemaTransformComponent } from 'views/open-api-docs-view-v2/schema-transforms/schema-transform-component'
import { shortenProtobufAnyDescription } from 'views/open-api-docs-view-v2/schema-transforms/shorten-protobuf-any-description'
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
	basePath: '/hcp/api-docs/packer',
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
		path: 'specs/cloud-packer-service',
		ref: 'main',
	},
	productContext: 'hcp',
	theme: 'packer',
	statusIndicatorConfig: {
		pageUrl: 'https://status.hashicorp.com',
		endpointUrl:
			'https://status.hashicorp.com/api/v2/components/0mbkqnrzg33w.json',
	},
	resourceLinks: [
		{
			text: 'Tutorial Library',
			href: '/tutorials/library?product=packer&edition=hcp',
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
