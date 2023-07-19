// Library
import { cachedGetProductData } from 'lib/get-product-data'
// Types
import type { OpenApiDocsParams, OpenApiDocsViewProps } from './types'
import type { ProductSlug } from 'types/products'
import type {
	GetStaticPaths,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next'

/**
 * Get static paths for the view.
 *
 * Initially, without versioning, we expect a single page. We use
 * `getStaticPaths` for flag-based compatibility with the previous template.
 *
 * Later, when we implement versioned API docs for the new template,
 * we'll likely need to retain `getStaticPaths`, using separate paths
 * for each version of the OpenAPI documents that we detect.
 */
export const getStaticPaths: GetStaticPaths<OpenApiDocsParams> = async () => {
	// For the new template, regardless of whether we're in a deploy preview
	// or production, statically render the single view.
	return {
		paths: [{ params: { page: [] } }],
		fallback: false,
	}
}

/**
 * Get static props for the view.
 *
 * This is where we expect to fetch the OpenAPI document, and transform
 * the schema `.json` data into props for the view component.
 *
 * For now, we have a placeholder. We'll expand this as we build out the view.
 */
export async function getStaticProps({
	productSlug,
	context,
}: {
	productSlug: ProductSlug
	context: GetStaticPropsContext<OpenApiDocsParams>
}): Promise<GetStaticPropsResult<OpenApiDocsViewProps>> {
	// Get the product data
	const productData = cachedGetProductData(productSlug)

	/**
	 * Determine the versionId
	 * If we a path part, we treat that as the versionId. Otherwise, latest.
	 */
	const pathParts = context.params?.page
	const versionId = pathParts?.length > 1 ? pathParts[0] : null

	return {
		props: {
			productData,
			IS_REVISED_TEMPLATE: true,
			_placeholder: {
				productSlug,
				versionId,
			},
		},
	}
}
