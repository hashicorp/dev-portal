/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import type { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import type { OpenAPIV3 } from 'openapi-types'
// App-wide types
import type { ApiDocsVersionData } from 'lib/api-docs/types'
import type { BreadcrumbLink } from '@components/breadcrumb-bar'
import type { GithubDir } from 'lib/fetch-github-file-tree'
import type { ProductData, ProductSlug } from 'types/products'
// Local types
import type { LandingContentProps } from './components/landing-content'
import type { VersionSwitcherProps } from '@components/version-switcher'
import type { OperationContentProps } from './components/operation-content'
import type { OperationObject } from './utils/get-operation-objects'

/**
 * Shared props are common to both the "landing" and "operation" views.
 */
export interface SharedProps {
	/**
	 * The URL path at which the docs are located.
	 */
	basePath: string
	/**
	 * Back to link, meant for navigating up a level of context
	 */
	backToLink: {
		text: string
		href: string
	}
	/**
	 * Breadcrumb links to render on the page.
	 */
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
	/**
	 * Link to the landing page, used in the sidebar and mobile menu.
	 */
	landingLink: {
		text: string
		href: string
		isActive: boolean
		theme: ProductSlug
	}
	/**
	 * Array of operation link groups to render in the sidebar and mobile menu.
	 */
	operationLinkGroups: {
		text: string
		items: {
			text: string
			href: string
			isActive: boolean
		}[]
	}[]
	/**
	 * Product data, used to render links in the mobile menu. Due to a code path
	 * in `_app`, this also affects the navigation context.
	 */
	product: ProductData
	resourceLinks?: {
		text: string
		href: string
		isExternal: boolean
	}[]
	/**
	 * Optional version metadata. Enables rendering of a version alert
	 * on non-default versions of the OpenAPI docs.
	 */
	versionMetadata?: {
		isVersionedUrl: boolean
		currentVersion: { versionId: string; releaseStage?: string }
		latestStableVersion: { versionId: string }
	}
	/**
	 * Optional props to render a version selector. Note that if there's
	 * only a single version, the version selector will not be rendered.
	 */
	versionSwitcherProps?: VersionSwitcherProps
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
 *
 * Ideally, we'll find a way at some point in the near future to make it
 * easier for content authors and other folks managing OpenAPI docs to
 * edit this configuration, and to add new pages.
 */
export interface OpenApiDocsViewV2Config {
	/**
	 * The URL path at which the docs are located. For example, the URL
	 * `developer.hashicorp.com/hcp/api-docs/hcp-vault-secrets` has the basePath
	 * `/hcp/api-docs/hcp-vault-secrets`
	 */
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
	 * Define a source for the OpenAPI schema. This can be a string,
	 * which is assumed to be the OpenAPI schema in JSON format, or it
	 * can be a GithubDir object, which is used to fetch versioned schema
	 * data from a structured directory in a specific Github repo.
	 */
	schemaSource: ApiDocsVersionData[] | GithubDir
	/**
	 * The product context for the OpenAPI docs. This is used to set the top bar
	 * nav elements, and the mobile menu layer the "level up" from the
	 * operation navigation links within the OpenAPI spec.
	 */
	productContext: ProductSlug
	/**
	 * Optional theme value to add specific product chrome to the view.
	 * For example, when the `vault` value is provided, the Vault logo will
	 * be shown in the sidebar and by the title of the OpenAPI spec.
	 *
	 * If omitted, will default to the value provided to `productContext`.
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
	 * Optional hook to allow transformation of versionData after it's been
	 * fetched from GitHub. Ideally we'd avoid this, the current use case
	 * is filtering out a specific version for `/hcp/api-docs/consul`.
	 */
	transformVersionData?: (v: ApiDocsVersionData[]) => ApiDocsVersionData[]
}

/**
 * Params type for `getStaticPaths` and `getStaticProps`.
 * Encodes our assumption that a `[[...page]].tsx` file is being used.
 */
export interface OpenApiDocsV2Params extends NextParsedUrlQuery {
	page: string[]
}

/**
 * URL context derived from params, used to encode the version ID and
 * operation slug from the URL.
 */
export interface ApiDocsUrlContext {
	/**
	 * Boolean describing whether the URL matches the versioned format.
	 */
	isVersionedUrl: boolean
	/**
	 * The version ID from the URL, or "latest" if the URL is not versioned.
	 */
	versionId: string
	/**
	 * The operation slug from the URL, if present.
	 */
	operationSlug: string | undefined
}
