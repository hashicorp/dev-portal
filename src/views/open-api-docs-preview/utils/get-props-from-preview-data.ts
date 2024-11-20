/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { generateStaticProps } from 'views/open-api-docs-view/server'
// Utils
import { getOperationGroupKeyFromPath } from 'views/open-api-docs-view/utils/get-operation-group-key-from-path'
import { schemaTransformShortenHcp } from 'views/open-api-docs-view/schema-transforms/schema-transform-shorten-hcp'
import { schemaTransformComponent } from 'views/open-api-docs-view/schema-transforms/schema-transform-component'
import { shortenProtobufAnyDescription } from 'views/open-api-docs-view/schema-transforms/shorten-protobuf-any-description'
// Types
import type {
	OpenApiDocsViewProps,
	OpenApiDocsViewConfig,
} from 'views/open-api-docs-view/types'
import type { OpenApiPreviewInputValues } from '../components/open-api-preview-inputs'

/**
 * Given preview data submitted by the user, which includes OpenAPI JSON,
 * and given an optional operation slug that indicates whether to render
 * a view for a specific operation,
 *
 * Return static props for the appropriate OpenAPI docs view.
 */
export default async function getPropsFromPreviewData(
	previewData: OpenApiPreviewInputValues | null,
	operationSlug: string | null
): Promise<OpenApiDocsViewProps | null> {
	// If we don't have any preview data, we can't expect to generate valid props
	if (!previewData) {
		return null
	}
	// Set up transformers for the spec. Typically we want to avoid these,
	// and prefer to have content updates made at the content source... but
	// some shims are used often enough that they feel worth including in the
	// preview too. Namely, shortening to `HCP` in the spec title.
	const schemaTransforms = [
		schemaTransformShortenHcp,
		(schema) => {
			return schemaTransformComponent(
				schema,
				'protobufAny',
				shortenProtobufAnyDescription
			)
		},
		(schema) => {
			return schemaTransformComponent(
				schema,
				'google.protobuf.Any',
				shortenProtobufAnyDescription
			)
		},
	]
	// Build page configuration based on the input values
	const pageConfig: Omit<OpenApiDocsViewConfig, 'schemaSource'> = {
		basePath: '/open-api-docs-preview',
		breadcrumbLinksPrefix: [
			{
				title: 'Developer',
				url: '/',
			},
		],
		schemaTransforms,
		productContext: 'hcp',
		// A generic set of resource links, as a preview of what typically
		// gets added to an OpenAPI docs page.
		resourceLinks: [
			{
				text: 'Tutorial Library',
				href: '/tutorials/library',
			},
			{
				text: 'Certifications',
				href: '/certifications',
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
		// Status indicator for HCP Services generally, to demo this feature
		statusIndicatorConfig: {
			pageUrl: 'https://status.hashicorp.com',
			endpointUrl:
				'https://status.hashicorp.com/api/v2/components/0q55nwmxngkc.json',
		},
	}
	// If the user has requested to group operations by path, we'll do so
	// by providing a custom `getOperationGroupKey` function. If this is omitted,
	// we go with the default behaviour of grouping operations based on `tag`.
	if (previewData.groupOperationsByPath) {
		pageConfig.getOperationGroupKey = getOperationGroupKeyFromPath
	}
	// Use the page config to generate static props for the view
	const staticProps = await generateStaticProps({
		...pageConfig,
		versionData: [
			{
				versionId: 'latest',
				releaseStage: 'Preview',
				sourceFile: previewData.openApiJsonString,
			},
		],
		urlContext: {
			isVersionedUrl: false,
			versionId: 'latest',
			operationSlug,
		},
	})
	// If the specific view wasn't found, return null
	if ('notFound' in staticProps) {
		return null
	}
	// Otherwise, return the props, discarding the enclosing object
	return staticProps.props
}
