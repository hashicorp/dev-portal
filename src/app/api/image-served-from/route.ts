/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { NextRequest } from 'next/server'

interface ResponseBody {
	servedFrom: string | null
}

function resolveImageUrl(src: string, requestHost: string): URL | null {
	try {
		if (src.startsWith('/')) {
			return new URL(`https://${requestHost}${src}`)
		}

		const parsed = new URL(src)
		if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
			return null
		}

		return parsed
	} catch {
		return null
	}
}

export async function GET(request: NextRequest) {
	if (process.env.HASHI_ENV !== 'unified-docs-sandbox') {
		return Response.json({ error: 'Not found' }, { status: 404 })
	}

	const rawSrc = request.nextUrl.searchParams.get('src')
	if (!rawSrc) {
		return Response.json(
			{ error: 'Missing src query parameter' },
			{ status: 400 }
		)
	}

	const requestHost = request.headers.get('host')
	if (!requestHost) {
		return Response.json(
			{ error: 'Missing request host header' },
			{ status: 400 }
		)
	}

	const imageUrl = resolveImageUrl(rawSrc, requestHost)
	if (!imageUrl) {
		return Response.json({ error: 'Invalid src URL' }, { status: 400 })
	}

	let servedFrom: ResponseBody['servedFrom'] = null

	try {
		const headResponse = await fetch(imageUrl.toString(), {
			method: 'HEAD',
			redirect: 'follow',
		})

		servedFrom = headResponse.headers.get('served-from')?.toLowerCase() ?? null

		if (!servedFrom) {
			const getResponse = await fetch(imageUrl.toString(), {
				method: 'GET',
				redirect: 'follow',
				headers: {
					Range: 'bytes=0-0',
				},
			})

			servedFrom = getResponse.headers.get('served-from')?.toLowerCase() ?? null
		}
	} catch {
		servedFrom = null
	}

	return Response.json({ servedFrom })
}
