import { buildApiRoutes } from '@hashicorp/react-marketo-form/server'
import type { NextApiRequest } from 'next'

async function submissionFilter(req: NextApiRequest): Promise<boolean> {
	// reject submissions with a @qq.com email address
	if (
		'input' in req.body &&
		req.body.input.length > 0 &&
		req.body.input[0].leadFormFields.email.includes('@qq.com')
	) {
		return false
	}

	return true
}

const routes = buildApiRoutes({ submissionFilter })

export default routes
