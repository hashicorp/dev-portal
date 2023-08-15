import { get } from '@vercel/edge-config'

import { fetchUserInfo, type UserInfoSchema } from 'lib/auth/fetch-user-info'

export const config = {
	runtime: 'experimental-edge',
}

import { z } from 'zod'

const bodySchema = z.object({
	task: z.string(),
})

const edgeConfigSchema = z.object({
	allowlist: z.record(z.boolean()),
})
type EdgeConfigSchema = z.infer<typeof edgeConfigSchema>

import { type NextRequest, type NextFetchEvent } from 'next/server'
export default async function edgehandler(
	req: NextRequest,
	evt: NextFetchEvent
) {
	console.log(`[${req.method}] ${req.url}`)

	const headers = req.headers
	const authorization = headers.get('authorization')
	if (!authorization) {
		return new Response('Not found', { status: 404 })
	}

	const jwt = authorization.split(' ')[1]

	let userInfo: UserInfoSchema
	try {
		// fetchUserInfo internally validates the JWT
		userInfo = await fetchUserInfo(jwt)
	} catch (e) {
		return new Response('Forbidden', { status: 401 })
	}

	const allowlist: EdgeConfigSchema['allowlist'] = await get('allowlist')
	if (!allowlist[userInfo.email]) {
		return new Response('403 Feature not enabled', { status: 403 })
	}

	switch (req.method) {
		case 'POST': {
			// read request body
			const body = await req.json()
			// validate request body
			const result = bodySchema.safeParse(body)
			if (!result.success) {
				return new Response('Bad Request', { status: 400 })
			}
			const { task } = result.data
			const res = await fetchCompletion({ task, accessToken: jwt })

			if (res.ok) {
				return new Response(res.body, {
					headers: { 'Content-Type': 'text/html; charset=utf-8' },
				})
			} else {
				return new Response(res.body, {
					status: res.status,
					headers: { 'Content-Type': 'application/json' },
				})
			}
		}
	}
}

async function fetchCompletion({ task, accessToken }) {
	const url = new URL('/v1/chat', process.env.EXPERIMENTAL_CHAT_API_BASE_URL)
	const body = JSON.stringify({ task })
	const headers = new Headers()
	headers.set('Authorization', `Bearer ${accessToken}`)
	headers.set('Content-Type', 'application/json')

	return await fetch(url.toString(), {
		body: body,
		method: 'POST',
		headers,
	})
}
