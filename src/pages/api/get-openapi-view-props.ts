import {
	OpenApiPageConfig,
	getStaticProps,
} from 'views/open-api-docs-view/server'
// Types
import type { NextApiRequest, NextApiResponse } from 'next'
import type { OpenAPIV3 } from 'openapi-types'

/**
 * We expected posted data to be nearly ready to pass to `getStaticProps`
 * for the view, which requires `OpenApiPageConfig` data.
 */
type ExpectedBody = Omit<OpenApiPageConfig, 'versionData'> & {
	openApiJsonString: string
	openApiDescription: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Reject non-POST requests, only POST is allowed
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		res.status(405).json({ error: 'Method not allowed' })
	}

	/**
	 * Build the static props from the POST'ed page configuration data,
	 * which includes the full OpenAPI spec as a string.
	 */
	const { openApiDescription, openApiJsonString, ...restPageConfig } =
		JSON.parse(req.body) as ExpectedBody

	/**
	 * Construct some preview data just to match the expected `getStaticProps`
	 * signature. The `versionId` and `releaseStage` don't really matter here.
	 */
	const versionData = [
		{
			versionId: 'preview',
			releaseStage: 'preview',
			sourceFile: openApiJsonString,
		},
	]

	/**
	 * Build static props for the page
	 */
	const staticProps = await getStaticProps({
		// Pass the bulk of the page config
		...restPageConfig,
		// Pass the constructed version data
		versionData,
		/**
		 * Massage the schema data a little bit, replacing
		 * "HashiCorp Cloud Platform" in the title with "HCP".
		 */
		massageSchemaForClient: (schemaData: OpenAPIV3.Document) => {
			// Replace the schema description with the POST'ed description, if present
			if (openApiDescription) {
				schemaData.info.description = openApiDescription
			}
			// Replace "HashiCorp Cloud Platform" with "HCP" in the title
			const massagedTitle = schemaData.info.title.replace(
				'HashiCorp Cloud Platform',
				'HCP'
			)
			// Return the schema data with the revised title
			const massagedInfo = { ...schemaData.info, title: massagedTitle }
			return { ...schemaData, info: massagedInfo }
		},
	})

	// Return the static props as JSON, these can be passed to OpenApiDocsView
	res.status(200).json(staticProps)
}
