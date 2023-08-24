import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// Reject non-POST requests, only POST is allowed
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		res.status(405).json({ error: 'Method not allowed' })
	}

	/**
	 * Build the static props from the POST'ed OpenAPI spec and additional data.
	 * TODO: actually receive data and build real props.
	 */
	const staticProps = {
		inputData: JSON.parse(req.body),
		props: { hello: 'todo add some static props here soon' },
	}

	// Return the static props as JSON, these can be passed to OpenApiDocsView
	res.status(200).json(staticProps)
}
