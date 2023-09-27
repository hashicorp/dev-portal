/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ReactElement } from 'react'
import type { ParsedUrlQuery } from 'querystring'
import type { GithubFile } from 'lib/fetch-github-file'
import type { BreadcrumbLink } from 'components/breadcrumb-bar'
import type { OperationObjectType } from 'components/open-api-page/types'
import type { SidebarProps } from 'components/sidebar'
import type { VersionSwitcherOption } from 'components/version-switcher/types'
import type { ProductData } from 'types/products'
import { ApiDocsVersionAlertProps } from './components/api-docs-version-alert/types'

/**
 * Params type for `getStaticPaths` and `getStaticProps`.
 * Encodes our assumption that a `[[page]].tsx` file is being used.
 */
export interface ApiDocsParams extends ParsedUrlQuery {
	page: string[]
}

/**
 * A type that covers the data from parsing Swagger `.json` file.
 *
 * Note: this is very incomplete, scoped to very basic info for now.
 * Intent is to later update this and match it or merge it with types in
 * 'components/open-api-page/types', which will be a larger lift outside
 * of the scope of current work.
 */
export interface ApiDocsSwaggerSchema {
	info: {
		title: string
	}
}

/**
 * A type for API services. API "services" are categories of operations.
 */
export interface ApiDocsServiceData {
	name: string
	slug: string
	operations: OperationObjectType[]
}

/**
 * Props needed to render `ApiDocsView`.
 */
export interface ApiDocsViewProps {
	/**
	 * Metadata is used to set the page title and description.
	 * Note this is not used by the view itself, instead we have some magic
	 * happening at the `_app.tsx` level, where we render `<HeadMetadata />`.
	 */
	metadata: {
		title: string
	}

	/**
	 * Layout props drive the breadcrumbs and sidebar in the
	 * SidebarSidecarLayout we use to render API docs.
	 */
	layoutProps: {
		breadcrumbLinks: BreadcrumbLink[]
		sidebarNavDataLevels: SidebarProps[]
	}

	/**
	 * A heading to render on the page. Text is typically the name of the API.
	 * Badge text is typically used for release stage, eg "stable" or "preview".
	 */
	pageHeading: {
		text: string
		badgeText?: string
	}

	/**
	 * Product data, used in the layout and elsewhere.
	 */
	product: ProductData

	/**
	 * Optional. By default, index page will be rendered, with no operation info.
	 * When `serviceData` data is passed, service operation details will render.
	 */
	serviceData?: ApiDocsServiceData

	/**
	 * Optional. Provide a function that modifies operation paths as they render.
	 * Receives `path` string as input, expects `path` string as output.
	 */
	massagePathFn?: (path: string) => string

	/**
	 * Optional. Provided a component to render at the start of each operation.
	 * Receives operation `{ data }` as `props` input.
	 */
	renderOperationIntro?: (props: { data: OperationObjectType }) => ReactElement

	/**
	 * Optional. If provided, renders versioned API docs links in a dropdown nav.
	 */
	versionSwitcherData?: {
		label: string
		options: VersionSwitcherOption[]
	}

	/**
	 * Optional. If set to `true`, a `noindex` tag will be added to the page.
	 */
	isVersionedUrl?: boolean

	/**
	 * Optional. If provided, a version alert will be shown.
	 */
	versionAlert?: ApiDocsVersionAlertProps
}
