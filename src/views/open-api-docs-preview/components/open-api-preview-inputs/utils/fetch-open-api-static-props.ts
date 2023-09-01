import type { OpenApiDocsViewProps } from 'views/open-api-docs-view/types'

const API_ROUTE = '/api/get-open-api-docs-view-props'

type Error = {
	title: string
	description: string
}

/**
 * Fetch static props for the page and update state when
 * the provided `inputValues` is submitted via a button activation.
 */
export async function fetchOpenApiStaticProps(inputValues: {
	openApiJsonString: string
	openApiDescription?: string
}): Promise<[Error | null, OpenApiDocsViewProps | null]> {
	try {
		const result = await fetch(API_ROUTE, {
			method: 'POST',
			body: JSON.stringify(inputValues),
		})
		const resultData = await result.json()
		return [null, resultData.props as OpenApiDocsViewProps]
	} catch (e) {
		return [
			{
				title: 'Failed to generate page data',
				description:
					'Failed to generate page data from the provided inputs. Please ensure the provided schema is valid JSON. Please also ensure the provided description is valid markdown.',
			},
			null,
		]
	}
}
