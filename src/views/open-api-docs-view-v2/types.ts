/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { LandingContentProps } from './components/landing-content'
import type { OpenAPIV3 } from 'openapi-types'
import type { OperationContentProps } from './components/operation-content'
import type { OperationObject } from './utils/get-operation-objects'
import type { ProductSlug } from 'types/products'

/**
 * Shared props are common to both the "landing" and "operation" views.
 */
export interface SharedProps {
	basePath: string
	backToLink: {
		text: string
		href: string
	}
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
	resourceLinks?: {
		text: string
		href: string
		isExternal: boolean
	}[]
}

/**
 * OpenApiDocsViewV2 props are used to render either a "landing" view, which
 * includes some introductory content to the API generally, or an "operation"
 * view, which includes details about specific operations.
 */
export type OpenApiDocsViewV2Props =
	| (SharedProps & { operationContentProps: OperationContentProps })
	| (SharedProps & { landingContentProps: LandingContentProps })

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
}
