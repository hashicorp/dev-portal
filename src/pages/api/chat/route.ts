import { type NextRequest, type NextFetchEvent } from 'next/server'
import { get } from '@vercel/edge-config'
import { z } from 'zod'

import { fetchUserInfo, type UserInfoSchema } from 'lib/auth/fetch-user-info'

export const config = {
	runtime: 'experimental-edge',
}

// POST body payload
const bodySchema = z.object({
	task: z.string().transform((e) => e.trim()),
})

const edgeConfigSchema = z.object({
	allowlist: z.record(z.string()),
})
type EdgeConfigSchema = z.infer<typeof edgeConfigSchema>

export default async function edgehandler(
	req: NextRequest,
	evt: NextFetchEvent
) {
	console.log(`[${req.method}] ${req.url}`)
	const authorization = req.headers.get('authorization')
	if (!authorization) {
		return new Response('Not found', { status: 404 })
	}

	const jwt = authorization.split(' ')[1]

	let userInfo: UserInfoSchema
	try {
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
			const parsedBody = bodySchema.safeParse(body)
			if (!parsedBody.success) {
				return new Response('Bad Request', { status: 400 })
			}
			const { task } = parsedBody.data

			try {
				const res = await createCompletion({ task, accessToken: jwt })

				if (res.ok) {
					const headers = res.headers
					const relatedIds = Array.from({ length: 10 }, (_, i) => i).reduce(
						(acc, cur) => {
							acc[`X-Related-Id-${cur}`] = headers.get(`x-related-id-${cur}`)
							return acc
						},
						{}
					)
					return new Response(res.body, {
						headers: {
							'Content-Type': 'text/event-stream; charset=utf-8',
							'X-Completion-Id': headers.get('x-completion-id'),
							...relatedIds,
						},
					})
				} else {
					return new Response(res.body, {
						status: res.status,
						headers: {
							'Content-Type': 'application/json',
						},
					})
				}
			} catch (e) {
				console.error(e)
				return new Response('Internal Server Error', { status: 500 })
			}
		}
	}
}

// POST /v1/chat
async function createCompletion({ task, accessToken }) {
	const headers = new Headers()
	headers.set('Authorization', `Bearer ${accessToken}`)
	headers.set('Content-Type', 'application/json')

	const url = new URL('/v1/chat', process.env.EXPERIMENTAL_CHAT_API_BASE_URL)
	const body = JSON.stringify({ task })

	return await fetch(url.toString(), {
		body: body,
		method: 'POST',
		headers,
	})
}
