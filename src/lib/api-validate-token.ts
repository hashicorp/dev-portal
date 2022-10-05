import type {
	NextApiHandler,
	NextApiRequest,
	NextApiResponse,
} from 'next/types'
import { StatusCodes } from 'http-status-codes'

const __DEV__ = process.env.NODE_ENV === 'development'
const __TEST__ = process.env.NODE_ENV === 'test'

interface ValidateTokenOptions {
	/**
	 * Token to validate against
	 */
	token: string
	/**
	 * Only applies token validation to the specified HTTP methods. Validates all if none are passed.
	 */
	onlyMethods?: string[]
}

/**
 * Validates a token passed in the 'authorization' header against a token declared in process.env.API_TOKEN
 */
export function validateToken(
	handler: NextApiHandler,
	options?: ValidateTokenOptions
) {
	return (req: NextApiRequest, res: NextApiResponse) => {
		const shouldValidateMethod =
			!options?.onlyMethods ||
			(req.method && options?.onlyMethods?.includes(req.method))

		// Ensure authorization, excluding dev environments and non-specified methods
		if (!__DEV__ && !__TEST__ && shouldValidateMethod) {
			// Validate we're passed a Bearer token
			const auth = req.headers['authorization']?.split(' ')

			if (!auth || auth.length < 2 || auth[0] !== 'Bearer') {
				res.status(StatusCodes.UNAUTHORIZED).end()
				return
			}

			// Validate the Bearer
			const bearer = auth[1]
			if (bearer !== options.token) {
				res.status(StatusCodes.UNAUTHORIZED).end()
				return
			}
		}

		return handler(req, res)
	}
}
