import type { ParsedUrlQuery } from 'querystring'
import type { BreadcrumbLink } from 'components/breadcrumb-bar'
import type { VersionSwitcherOption } from 'components/version-switcher/types'
import { GithubFile } from 'lib/fetch-github-file'
import type { ProductData } from 'types/products'
import { OperationObjectType } from 'components/open-api-page/types'
import { ReactElement } from 'react'

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
 * A type to describe versioned API docs source files.
 */
export interface ApiDocsVersionData {
	// A unique id for this version, used to construct URL paths for example
	versionId: string
	// The release stage of this version of the API docs
	releaseStage: string // typically 'stable' | 'preview'
	// The schema file we'll fetch and render into the page for this version
	targetFile: GithubFile
}

/**
 * Props needed to render `ApiDocsView`.
 */
export interface ApiDocsViewProps {
	/**
	 * Layout props drive the breadcrumbs and sidebar in the
	 * SidebarSidecarLayout we use to render API docs.
	 */
	layoutProps: {
		breadcrumbLinks: BreadcrumbLink[]
		sidebarNavDataLevels: $TSFixMe
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
}
