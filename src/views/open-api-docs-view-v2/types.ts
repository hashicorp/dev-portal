/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { OpenAPIV3 } from 'openapi-types'
import type { OperationContentProps } from './components/operation-content'
import type { LandingContentProps } from './components/landing-content'
import type { OperationObject } from './utils/get-operation-objects'
import type { ProductData, ProductSlug } from 'types/products'
import type { BreadcrumbLink } from '@components/breadcrumb-bar'

/**
 * Shared props are common to both the "landing" and "operation" views.
 */
export interface SharedProps {
	basePath: string
	backToLink: {
		text: string
		href: string
	}
	breadcrumbLinks: {
		title: string
		/**
		 * Note: our BreadcrumbBar component has an interface that implies it
		 * supports items without `url` values, but it actually filters out those
		 * items and never renders them. We likely want to update either the
		 * interface, to require URLs, or the component, to render items without
		 * URLs. The latter might make sense if we're conceptualizing breadcrumb
		 * links as serving both a navigational AND "orienting" purpose, as we
		 * can then show an accurate hierarchical structure, even if a given page
		 * in that structure doesn't exist (eg `/hcp/api-docs`).
		 *
		 * For example...
		 *
		 * When strictly requiring URLs, we might have:
		 * URL: `/hcp/api-docs/vault-secrets`
		 * Breadcrumb: `Developer > HCP > Vault Secrets`
		 * This breadcrumb does NOT show that we're looking at API docs.
		 *
		 * When allowing items without URLs, we might have:
		 * URL: `/hcp/api-docs/vault-secrets`
		 * Breadcrumb: `Developer > HCP > API Docs > Vault Secrets`
		 */
		url?: string
		isCurrentPage?: boolean
	}[]
	landingLink: {
		text: string
		href: string
		isActive: boolean
		theme: ProductSlug
	}
	operationLinkGroups: {
		text: string
		items: {
			text: string
			href: string
			isActive: boolean
		}[]
	}[]
	productData: ProductData
	resourceLinks?: {
		text: string
		href: string
		isExternal: boolean
	}[]
}

/**
 * Configure a status indicator for a status-page service.
 */
export interface StatusIndicatorConfig {
	/**
	 * A status-page component URL we can GET JSON data from, in the format
	 * `https://status.hashicorp.com/api/v2/components/{componentId}.json`.
	 */
	endpointUrl: string
	/**
	 * A browser-friendly status page URL, like `https://status.hashicorp.com`
	 */
	pageUrl: string
}

/**
 * OpenApiDocsViewV2 props are used to render either a "landing" view, which
 * includes some introductory content to the API generally, or an "operation"
 * view, which includes details about specific operations.
 */
export type OpenApiDocsViewV2Props =
	| (SharedProps & { operationContentProps: OperationContentProps })
	| (SharedProps & { landingProps: LandingContentProps })

/**
 * OpenApiDocsViewV2Config is used to set up and configure a set of
 * OpenAPI docs views. The options provided here are meant to allow
 * full control over all the possible variations of an OpenAPI docs view
 * we might want to render.
 *
 * We want to keep these configuration options as simple as possible, as
 * they must be configured for each new set of OpenAPI specs that we add.
 */
export interface OpenApiDocsViewV2Config {
	/**
	 * The URL path at which the docs are located. For example, the URL
	 * `developer.hashicorp.com/hcp/api-docs/hcp-vault-secrets` has the basePath
	 * `/hcp/api-docs/hcp-vault-secrets`. */
	basePath: string
	/**
	 * Optional breadcrumb links to render before the generated breadcrumb links.
	 * We build breadcrumbs like `[...breadcrumbLinksPrefix, ...generatedLinks]`,
	 * where `generatedLinks` are:
	 * - `<basePath>` - the OpenAPI spec's `title` will be used as text
	 * - `<basePath>/<operationSlug>` - operation slugs used as text
	 *
	 * As an example, for HCP Vault Secrets, we might set `breadcrumbLinksPrefix`
	 * to include links leading up to the basePath, like:
	 * - { title: 'Developer', url: '/' },
	 * - { title: 'HCP', url: '/hcp' },
	 * - { title: 'API Docs', url: '/hcp/api-docs' }
	 * And, for example, the generated breadcrumbs that would be added for a
	 * `SetTier` operation page might look like:
	 * - { title: 'HCP Vault Secrets', url: '/hcp/api-docs/vault-secrets' }
	 * - { title: 'SetTier', url: '/hcp/api-docs/vault-secrets/SetTier' }
	 */
	breadcrumbLinksPrefix?: BreadcrumbLink[]
	/**
	 * Optional link to move up a level of context. Typically used to link
	 * back to higher level documentation for the subject of the OpenAPI docs. k
	 */
	backToLink?: {
		text: string
		href: string
	}
	/**
	 * Optional function to control how operation objects are grouped in the
	 * sidebar. By default, getOperationGroupKey looks for the first `tag`
	 * value of each operation, such that operations are grouped by their
	 * first tag.
	 */
	getOperationGroupKey?: (o: OperationObject) => string
	/**
	 * The OpenAPI schema as a JSON string.
	 */
	openApiJsonString: string
	/**
	 * Optional operation slug to render a specific operation view.
	 */
	operationSlug?: string
	/**
	 * Optional theme value to add specific product chrome to the view.
	 * For example, when the `vault` value is provided, the Vault logo will
	 * be shown in the sidebar and by the title of the OpenAPI spec.
	 */
	theme?: ProductSlug
	/**
	 * Optional array of functions to transform the OpenAPI schema before
	 * rendering the view. This allows content to be manipulated before
	 * we render the view. While in most cases it's ideal to make content
	 * changes at the content source (typically the `hashicorp/hcp-specs` repo),
	 * sometimes our development timeline or other technical constraints
	 * necessitate programmatically making changes just before rendering.
	 */
	schemaTransforms?: ((s: OpenAPIV3.Document) => OpenAPIV3.Document)[]
	/**
	 * Optional array of resource item links to render at the bottom
	 * of the sidebar. External links open in a new tab.
	 */
	resourceLinks?: {
		text: string
		href: string
	}[]
	/**
	 * Configuration to set up a status indicator.
	 */
	statusIndicatorConfig?: StatusIndicatorConfig
	/**
	 * Optional release stage to display in a badge at the top of the page.
	 * Typical values include `Stable`, `Preview`, etc.
	 */
	releaseStage?: string
}
