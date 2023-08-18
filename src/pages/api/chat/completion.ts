import { type NextRequest, type NextFetchEvent } from 'next/server'
import { get } from '@vercel/edge-config'
import { z } from 'zod'

import { fetchUserInfo, type UserInfoSchema } from 'lib/auth/fetch-user-info'

export const config = {
	runtime: 'experimental-edge',
}

// PATCH body payload
const bodySchema = z.object({
	sentiment: z.number().min(-1).max(1).optional(),
	reason: z
		.string()
		.optional()
		.transform((e) => e.trim()),
	messageId: z.string(),
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
		case 'PATCH': {
			// read request body
			const body = await req.json()
			// validate request body
			const parsedBody = bodySchema.safeParse(body)
			if (!parsedBody.success) {
				return new Response('Bad Request', { status: 400 })
			}
			const { reason, sentiment, messageId } = parsedBody.data

			const res = await updateCompletion(
				{
					messageId,
					accessToken: jwt,
				},
				{ reason, sentiment }
			)
			const data = await res.json()

			return new Response(data, { status: res.status })
		}
	}
}

// PATCH /v1/chat/:completion_id
async function updateCompletion(
	{ messageId, accessToken },
	{ reason, sentiment }
) {
	const headers = new Headers()
	headers.set('Authorization', `Bearer ${accessToken}`)
	headers.set('Content-Type', 'application/json')

	const url = new URL(
		`/v1/chat/${messageId}`,
		process.env.EXPERIMENTAL_CHAT_API_BASE_URL
	)
	const body: Record<string, any> = {}
	if (reason) {
		body.reason = reason
	}
	if (sentiment) {
		body.sentiment = sentiment
	}

	return fetch(url.toString(), {
		body: JSON.stringify(body),
		method: 'PATCH',
		headers,
	})
}