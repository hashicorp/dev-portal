/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { withTiming } from 'lib/with-timing'

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
const fetch = (...params) => {
	const url = params[0]
	const method = params[1]?.method || 'GET'
	return withTiming(
		`[lib/learn-client] (${method} ${url})`,
		() => getFetch()(...params),
		false
	)
}

export async function get(path: string, token?: string) {
	const options: RequestInit = {
		method: 'GET',
	}
	// if the req needs to be auth'd, add the bearer token
	if (token) {
		options.headers = {
			Authorization: `Bearer ${token}`,
		}
	}

	// If production build & server, attempt to read from fs as cache
	if (
		process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD &&
		typeof window === 'undefined'
	) {
		const _fs = await import('fs')
		const _path = await import('path')
		const cacheDir = _path.join(process.cwd(), '.learn-cache')

		// try to make the cache dir
		try {
			console.log('- creating cache dir')
			_fs.mkdirSync(cacheDir)
			console.log("- created cache dir: '%s'", cacheDir)
		} catch (e) {
			console.log('- erroring creating cache dir', e.message)
			// if it already exists, that's fine
		}

		const cachePath = _path.join(cacheDir, path.replace(/[/?<>\\:*|"]/g, '_'))

		// If the file exists, return it
		try {
			const file = _fs.readFileSync(cachePath, { encoding: 'utf-8' })
			console.log('[cache HIT]', cachePath)
			return {
				ok: true,
				json: async () => JSON.parse(file),
			}
		} catch (e) {
			console.log('[cache MISS]', cachePath)
			// If the file doesn't exist, request and cache it
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_LEARN_API_BASE_URL}${path}`,
				options
			)
			const json = await res.json()

			try {
				console.log("- writing cache file: '%s'", cachePath)
				_fs.writeFileSync(cachePath, JSON.stringify(json))
				console.log("- wrote cache file: '%s'", cachePath)
				return {
					ok: res.ok,
					json: async () => json,
				}
			} catch (e) {
				console.log('- error writing cache file', e.message)
				return {
					ok: res.ok,
					json: async () => json,
				}
			}
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
