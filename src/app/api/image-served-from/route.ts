/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { NextRequest } from 'next/server'

interface ResponseBody {
	servedFrom: string | null
}

export async function GET(request: NextRequest) {
	if (process.env.HASHI_ENV !== 'unified-docs-sandbox') {
		return Response.json({ error: 'Not found' }, { status: 404 })
	}

	const rawSrc = request.nextUrl.searchParams.get('src') ?? ''
	const requestHost = request.headers.get('host') ?? ''
	const imageUrl = new URL(rawSrc, `https://${requestHost}`)

	const headResponse = await fetch(imageUrl.toString(), {
		method: 'HEAD',
	})

	const servedFrom: ResponseBody['servedFrom'] =
		headResponse.headers.get('served-from')?.toLowerCase() ?? null

	return Response.json({ servedFrom })
}
