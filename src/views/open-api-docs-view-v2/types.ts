/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { OperationContentProps } from './components/operation-content'
import { LandingContentProps } from './components/landing-content'

/**
 * Nav items are used to render the sidebar.
 *
 * TODO: will likely need to be expanded once a more fully-featured sidebar
 * is constructed. Older OpenAPI docs view may be useful for prior art, though
 * we probably don't need to feel too tied to it.
 */
export type OpenApiNavItem = {
	title: string
	fullPath: string
	isActive: boolean
}

/**
 * Shared props are common to both the "landing" and "operation" views.
 */
export interface SharedProps {
	basePath: string
	navItemLanding: OpenApiNavItem
	navItemGroups: { title: string; items: OpenApiNavItem[] }[]
}

/**
 * OpenApiDocsViewV2 props are used to render either a "landing" view, which
 * includes some introductory content to the API generally, or an "operation"
 * view, which includes details about specific operations.
 */
export type OpenApiDocsViewV2Props =
	| (SharedProps & { operationContentProps: OperationContentProps })
	| (SharedProps & { landingContentProps: LandingContentProps })
