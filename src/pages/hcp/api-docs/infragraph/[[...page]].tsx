/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// View
import OpenApiDocsViewV2 from 'views/open-api-docs-view-v2'
import { generateStaticPropsVersioned } from 'views/open-api-docs-view-v2/server'
// Utils
import { isDeployPreview } from 'lib/env-checks'
import { getOperationGroupKeyFromPath } from 'views/open-api-docs-view-v2/utils/get-operation-group-key-from-path'
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
	basePath: '/hcp/api-docs/infragraph',
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
		path: 'specs/cloud-infragraph',
		ref: 'main',
	},
	productContext: 'hcp',
	theme: 'hcp',
	getOperationGroupKey: getOperationGroupKeyFromPath,
	resourceLinks: [
		{
			text: 'Tutorials',
			href: '/hcp/tutorials/infragraph',
		},
		{
			text: 'Community',
			href: 'https://discuss.hashicorp.com/',
		},
		{
			text: 'Support',
			href: 'https://www.ibm.com/mysupport',
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
	shouldNoIndex: true,
}

/**
 * Get static paths for the infragraph OpenAPI docs view.
 *
 * Unlike most OpenAPI specs (which use the shared `generateStaticPaths` to
 * pre-render a page for every operation), the `cloud-infragraph` spec is very
 * large. Statically rendering every operation page at build time parses and
 * holds the full schema in memory for each path, which exhausts the Node heap
 * and causes a "JavaScript heap out of memory" crash during `next build`.
 *
 * To avoid this, we only pre-render the landing page and rely on
 * `fallback: 'blocking'` to render individual operation pages on-demand. This
 * matches how versioned views are already handled in `generateStaticPaths`.
 */
export const getStaticPaths: GetStaticPaths<OpenApiDocsV2Params> = async () => {
	// In product repo deploy previews, don't pre-render any paths.
	if (isDeployPreview()) {
		return { paths: [], fallback: 'blocking' }
	}
	// Only pre-render the landing page; operation pages render via fallback.
	return {
		paths: [{ params: { page: [] } }],
		fallback: 'blocking',
	}
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
