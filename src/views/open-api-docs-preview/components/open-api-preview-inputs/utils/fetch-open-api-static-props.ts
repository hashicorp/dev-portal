/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { OpenApiDocsViewProps } from 'views/open-api-docs-view/types'

const API_ROUTE = '/api/get-open-api-docs-view-props'

type Error = {
	title: string
	description: string
	error: string
}

/**
 * Fetch static props for the page and update state when
 * the provided `inputValues` is submitted via a button activation.
 */
export async function fetchOpenApiStaticProps(inputValues: {
	openApiJsonString: string
	openApiDescription?: string
	groupOperationsByPath?: boolean
}): Promise<[Error | null, OpenApiDocsViewProps | null]> {
	try {
		const result = await fetch(API_ROUTE, {
			method: 'POST',
			body: JSON.stringify(inputValues),
		})
		const resultData = await result.json()
		if (resultData.error) {
			return [
				{
					title: 'Failed to generate page data',
					description:
						'An error occured while attempting to generate page data from the provided inputs. Please ensure the provided schema is a valid OpenAPI specification in JSON format. Please also ensure the provided description is valid markdown.',
					error: resultData.error,
				},
				null,
			]
		} else {
			return [null, resultData.props as OpenApiDocsViewProps]
		}
	} catch (error) {
		return [
			{
				title: 'Failed to generate page data',
				description:
					"An unexpected error occurred while attempting to generate page data from the provided inputs. Please ensure the provided schema is a valid OpenAPI specification in JSON format. Please also ensure the provided description is valid markdown. And reach out to the team in #proj-dev-portal if this still isn't working!",
				error: error.toString(),
			},
			null,
		]
	}
}
