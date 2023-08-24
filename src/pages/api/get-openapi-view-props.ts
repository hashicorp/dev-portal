import { NextApiRequest, NextApiResponse } from 'next'
import { getStaticProps } from 'views/open-api-docs-view/server'

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
	const staticProps = await getStaticProps(pageConfiguration)

	// Return the static props as JSON, these can be passed to OpenApiDocsView
	res.status(200).json(staticProps)
}
