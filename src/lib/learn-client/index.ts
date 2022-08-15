function getFetch() {
	// Note: purposely doing a conditional require here so that `@vercel/fetch` is not included in the client bundle
	if (typeof window === 'undefined') {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const createFetch = require('@vercel/fetch')
		return createFetch()
	}
	return window.fetch
}

// some of our reqs occur in a node env where fetch
// isn't defined e.g. algolia search script
const fetch = getFetch()

export function get(path: string, token?: string) {
	const options: RequestInit = {
		method: 'GET',
	}
	// if the req needs to be auth'd, add the bearer token
	if (token) {
		options.headers = {
			Authorization: `Bearer ${token}`,
		}
	}

	return fetch(`${process.env.NEXT_PUBLIC_LEARN_API_BASE_URL}${path}`, options)
}

export function put(path, token, bodyJson) {
	return fetch(`${process.env.NEXT_PUBLIC_LEARN_API_BASE_URL}${path}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-type': 'application/json',
		},
		body: JSON.stringify(bodyJson),
	})
}

export function post(path, token, bodyJson = {}) {
	return fetch(`${process.env.NEXT_PUBLIC_LEARN_API_BASE_URL}${path}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-type': 'application/json',
		},
		body: JSON.stringify(bodyJson),
	})
}

export function destroy(path, token) {
	return fetch(`${process.env.NEXT_PUBLIC_LEARN_API_BASE_URL}${path}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

export async function toError(errorResponse) {
	let json
	try {
		json = await errorResponse.json()
	} catch (err) {
		// Do nothing if the response is not json
	}

	return new Error(
		`${errorResponse.status} ${errorResponse.statusText}${
			json?.error ? ` - ${json.error}` : ''
		}`
	)
}
