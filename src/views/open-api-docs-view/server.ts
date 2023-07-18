import { GetStaticPaths, GetStaticProps } from 'next'
import { OpenApiDocsParams, OpenApiDocsViewProps } from './types'

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
export const getStaticProps: GetStaticProps<
	OpenApiDocsViewProps
> = async () => {
	return {
		props: {
			placeholder: 'placeholder data for the revised API docs template',
			IS_REVISED_TEMPLATE: true,
		},
	}
}
