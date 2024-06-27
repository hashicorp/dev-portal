/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import type { OpenAPIV3 } from 'openapi-types'
import type { ParsedUrlQuery } from 'querystring'
import type { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
// Global
import type { ProductData, ProductSlug } from 'types/products'
import type { GithubDir } from 'lib/fetch-github-file-tree'
import type { BreadcrumbLink } from 'components/breadcrumb-bar'
import type { VersionSwitcherProps } from 'components/version-switcher'
// Local
// TODO: replace import below, localize this component to v2 folder
import type { PropertyDetailsSectionProps } from '../open-api-docs-view/components/operation-details'

/**
 * Operations are specific request types to specific endpoints.
 * They form the basis of OpenAPI docs pages.
 */
export interface OperationProps {
	operationId: string
	tags: string[]
	slug: string
	type: string
	path: {
		full: string
		truncated: string
	}
	requestData: PropertyDetailsSectionProps
	responseData: PropertyDetailsSectionProps
	summary?: string
	/**
	 * Syntax-highlighted HTML that represents the URL path, with
	 * word breaks to allow long URLs to wrap to multiple lines.
	 */
	urlPathForCodeBlock: string
}

/**
 * Operation groups collect operations into sections based
 * on the operation paths.
 */
export type OperationGroup = { heading: string; items: OperationProps[] }

/**
 * Params type for `getStaticPaths` and `getStaticProps`.
 * Encodes our assumption that a `[[...page]].tsx` file is being used.
 *
 * Note: this is only needed for compatibility with the previous API docs,
 * which could potentially render multiple pages, one for each service.
 * In this revised template, we only render a single page.
 *
 * We will still need a dynamic route for versioning, but will need a refactor.
 * Versioning task: https://app.asana.com/0/1204678746647847/1205062681720537/f
 */
export interface OpenApiDocsParams extends ParsedUrlQuery {
	page: string[]
}

/**
 * Nav items are used to render the sidebar and mobile nav.
 *
 * TODO: move these types to sidebar component.
 * For now, this is difficult, as the MenuItem type is a complex
 * interface that requires a larger effort to untangle, and all
 * related Sidebar components are similarly entangled.
 * Rationale is to start with simpler slightly duplicative types here,
 * rather than try to embark on the `MenuItem` type refactor.
 * Task: https://app.asana.com/0/1202097197789424/1202405210286689/f
 */
type DividerNavItem = { divider: true }
type HeadingNavItem = { heading: string }
type ExternalLinkNavItem = {
	title: string
	href: string
}
export type LinkNavItem = {
	title: string
	fullPath: string
	theme?: ProductSlug
	isActive?: boolean
}

export type OpenApiNavItem =
	| DividerNavItem
	| HeadingNavItem
	| LinkNavItem
	| ExternalLinkNavItem

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
 * We'll use this type to document the shape of props for the view component.
 * For now, we have a placeholder. We'll expand this as we build out the view.
 */
export interface OpenApiDocsViewV2Props {
	/**
	 * Metadata is used to set the page title and description.
	 * Note this is not used by the view itself, instead we have some magic
	 * happening at the `_app.tsx` level, where we render `<HeadMetadata />`.
	 */
	metadata: {
		title: string
	}

	productData: ProductData
	topOfPageHeading: {
		text: string
		id: string
	}
	descriptionMdx: MDXRemoteSerializeResult
	releaseStage: string

	/**
	 * Operations form the basis of OpenAPI docs.
	 * They're grouped into sections based on operation paths.
	 */
	operationGroups: OperationGroup[]
	/**
	 * `navItems` appear in the main area of the sidebar and mobile nav.
	 */
	navItems: OpenApiNavItem[]

	/**
	 * `navResourceItems` appear at the bottom of the sidebar and mobile nav.
	 */
	navResourceItems: OpenApiNavItem[]

	/**
	 * Breadcrumb links are shown in the breadcrumb nav.
	 */
	breadcrumbLinks: BreadcrumbLink[]

	/**
	 * Configuration for the status-page indicator in the header area.
	 */
	statusIndicatorConfig: StatusIndicatorConfig

	/**
	 * Product slug to use for the theming of the service itself.
	 * For example, many product-themed services exist within the broader
	 * HCP product context. In those cases, the API docs pages would have
	 * `productData` for `hcp`, and a different `serviceProductSlug` here.
	 */
	serviceProductSlug: ProductSlug

	/**
	 * Boolean to indicate whether the URL being rendered is a versioned URL,
	 * in which case we want to no-index the page.
	 */
	isVersionedUrl: boolean

	/**
	 * Optional version data. Use this for API docs with multiple versions, the
	 * `label` and `options` here will be passed directly to `VersionSwitcher`.
	 */
	versionSwitcherProps?: VersionSwitcherProps

	/**
	 * TODO
	 */
	sidebarItemGroups?: $TSFixMe

	/**
	 * TODO
	 */
	operationProps?: $TSFixMe
}

/**
 * Type definition for OpenApiDocsView server-side page configuration
 */
export interface OpenApiDocsV2PageConfig {
	/**
	 * The product slug is used to fetch product data for the layout.
	 */
	productSlug: ProductSlug

	/**
	 * Optional slug used to theme smaller elements within the service API docs.
	 * For example, HCP consul will have a `productSlug` of `hcp`,
	 * but a `serviceProductSlug` of `consul`. If omitted, the `productSlug`
	 * will be used.
	 */
	serviceProductSlug?: ProductSlug

	/**
	 * The baseUrl is used to generate
	 * breadcrumb links, sidebar nav levels, and version switcher links.
	 */
	basePath: string
	/**
	 * Resource items are shown in the sidebar
	 */
	navResourceItems: OpenApiNavItem[]
	/**
	 * We source version data from a directory in the `hcp-specs` repo.
	 * See `fetchCloudApiVersionData` for details.
	 */
	githubSourceDirectory: GithubDir
	/**
	 * Optional config to power the status page indicator in the header area.
	 */
	statusIndicatorConfig?: {
		pageUrl: string
		endpointUrl: string
	}

	/**
	 * Optional transform hook to run just after the OpenAPI schema is
	 * parsed and validated, but before we de-reference the schema.
	 */
	massageSchemaForClient?: (schema: OpenAPIV3.Document) => OpenAPIV3.Document

	/**
	 * The top-of-page heading optionally have an id other than "overview".
	 * This heading ID is used to jump to the top of the page
	 */
	topOfPageId?: string
	/**
	 * Optionally group operations by their URL path. By default, operations are
	 * grouped by their first `tag`, which is expected to correspond to a service.
	 * In some cases, a spec may only have a single service, rendering this
	 * tag-based grouping less useful.
	 */
	groupOperationsByPath?: boolean
}
