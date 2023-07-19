import type { ParsedUrlQuery } from 'querystring'
import { ProductData } from 'types/products'

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
	productData: ProductData
	IS_REVISED_TEMPLATE: true
	_placeholder: $TSFixMe
}
