import type { ParsedUrlQuery } from 'querystring'
import type { ProductData } from 'types/products'
import type { GithubFile } from 'lib/fetch-github-file'

/**
 * A type to describe versioned API docs source files.
 */
export interface OpenApiDocsVersionData {
	// A unique id for this version, used to construct URL paths for example
	versionId: string
	// The release stage of this version of the API docs
	releaseStage?: string // typically 'stable' | 'preview'
	// The schema file we'll load and render into the page for this version
	targetFile: GithubFile | string
}

/**
 * Params type for `getStaticPaths` and `getStaticProps`.
 * Encodes our assumption that a `[[page]].tsx` file is being used.
 *
 * Note: this is only needed for compatibility with the previous API docs,
 * which could potentially render multiple pages, one for each service.
 * In this revised template, we only render a single page.
 *
 * We will still need a dynamic route for versioning, but will need a refactor.
 * TODO: revise this type once we've fully activated and then removed the
 * `enable_hcp_vault_secrets_api_docs_revision` flag.
 */
export interface OpenApiDocsParams extends ParsedUrlQuery {
	page: string[]
}

/**
 * We'll use this type to document the shape of props for the view component.
 * For now, we have a placeholder. We'll expand this as we build out the view.
 */
export interface OpenApiDocsViewProps {
	IS_REVISED_TEMPLATE: true
	productData: ProductData
	/**
	 * Some temporary data we'll remove for the production implementation.
	 */
	_placeholder: $TSFixMe
}
