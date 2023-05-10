import { Response } from '@vercel/fetch'

/**
 * Format an error response from the Learn API, and throw it as an Error.
 */
export async function toError(errorResponse: Response): Promise<void | Error> {
	let json
	try {
		json = await errorResponse.json()
	} catch (err) {
		// Throw a generic error if the response is not json
		throw new Error(
			`Could not parse errorResponse as JSON. "errorResponse" was "${errorResponse}", and caught error was "${err}".`
		)
	}

	return new Error(
		`${errorResponse.status} ${errorResponse.statusText}${
			json?.error ? ` - ${json.error}` : ''
		}`
	)
}
