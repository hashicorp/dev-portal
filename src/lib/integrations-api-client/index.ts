function getFetch() {
	// Note: purposely doing a conditional require here so that
	// `@vercel/fetch` is not included in the client bundle
	if (typeof window === 'undefined') {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const createFetch = require('@vercel/fetch')
		return createFetch()
	}
	return window.fetch
}

const fetch = getFetch()

export function fetchProductIntegrations(product: string) {
	return fetch(
		`${process.env.NEXT_PUBLIC_INTEGRATIONS_API_BASE_URL}/products/${product}/integrations`,
		{
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
		.then((res) => res.json())
		.then((res) => res.result)
}

export function fetchIntegration(product: string, slug: string) {
	return fetch(
		`${process.env.NEXT_PUBLIC_INTEGRATIONS_API_BASE_URL}/products/${product}/integrations/${slug}`,
		{
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
		.then((res) => res.json())
		.then((res) => res.result)
}

export function fetchIntegrationRelease(
	product: string,
	slug: string,
	version: string
) {
	return fetch(
		`${process.env.NEXT_PUBLIC_INTEGRATIONS_API_BASE_URL}/products/${product}/integrations/${slug}/releases/${version}`,
		{
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
		.then((res) => res.json())
		.then((res) => res.result)
}
