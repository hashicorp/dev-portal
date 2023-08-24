import { getStaticProps } from 'views/open-api-docs-view/server'
// Types
import type { NextApiRequest, NextApiResponse } from 'next'
import type { OpenAPIV3 } from 'openapi-types'

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
	const pageConfiguration = JSON.parse(req.body)
	const staticProps = await getStaticProps({
		...pageConfiguration,
		/**
		 * Massage the schema data a little bit, replacing
		 * "HashiCorp Cloud Platform" in the title with "HCP".
		 */
		massageSchemaForClient: (schemaData: OpenAPIV3.Document) => {
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
