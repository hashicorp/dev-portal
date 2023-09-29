/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type NextRequest, type NextFetchEvent } from 'next/server'
import { z } from 'zod'

export const config = {
	runtime: 'experimental-edge',
}

// POST body payload
const bodySchema = z.object({
	task: z.string().transform((e) => e.trim()),
	conversationId: z.string().optional(), // noop until we're ready for multi-message conversations
	parentMessageId: z.string().optional(), // noop until we're ready for multi-message conversations
})

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

	switch (req.method) {
		case 'POST': {
			// read request body
			const body = await req.json()
			// validate request body
			const parsedBody = bodySchema.safeParse(body)
			if (!parsedBody.success) {
				return new Response('Bad Request', { status: 400 })
			}
			const { task, conversationId, parentMessageId } = parsedBody.data

			try {
				let res: Response
				if (conversationId && parentMessageId) {
					console.log(
						'continue conversation: %s - %s',
						conversationId,
						parentMessageId
					)
					res = await continueConversation({
						conversationId,
						parentMessageId,
						task,
						accessToken: jwt,
					})
				} else {
					console.log('create conversation')
					res = await createConversation({ task, accessToken: jwt })
				}

				const headers = res.headers
				if (res.ok) {
					const conversationId = headers.get('x-conversation-id')
					const messageId = headers.get('x-message-id')
					if (!messageId) {
						console.warn(
							'[/api/chat/route] x-message-id header is missing from the server'
						)
					}
					if (!conversationId) {
						console.warn(
							'[/api/chat/route] x-conversation-id header is missing from the server'
						)
					}
					return new Response(res.body, {
						headers: {
							'Content-Type': 'text/event-stream; charset=utf-8',
							'x-message-id': messageId,
							'x-conversation-id': conversationId,
						},
					})
				} else {
					// additional Headers
					const additionalHeaders = {}

					if (res.status == 429) {
						// forward rate limit headers
						const X_RATELIMIT_LIMIT = 'x-ratelimit-limit'
						const X_RATELIMIT_REMAINING = 'x-ratelimit-remaining'
						const X_RATELIMIT_RESET = 'x-ratelimit-reset' // timestamp in seconds, like 1691509833
						const X_RATELIMIT_RESOURCE = 'x-ratelimit-resource'
						const X_RATELIMIT_USED = 'x-ratelimit-used'
						additionalHeaders[X_RATELIMIT_LIMIT] =
							res.headers.get(X_RATELIMIT_LIMIT)
						additionalHeaders[X_RATELIMIT_REMAINING] = res.headers.get(
							X_RATELIMIT_REMAINING
						)
						additionalHeaders[X_RATELIMIT_RESET] =
							res.headers.get(X_RATELIMIT_RESET)
						additionalHeaders[X_RATELIMIT_RESOURCE] =
							res.headers.get(X_RATELIMIT_RESOURCE)
						additionalHeaders[X_RATELIMIT_USED] =
							res.headers.get(X_RATELIMIT_USED)
					}

					return new Response(res.body, {
						status: res.status,
						headers: {
							...additionalHeaders,
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

// POST /v1/conversations
async function createConversation({ task, accessToken }) {
	const headers = new Headers()
	headers.set('Authorization', `Bearer ${accessToken}`)
	headers.set('Content-Type', 'application/json')

	const url = new URL(
		'/v1/conversations',
		process.env.EXPERIMENTAL_CHAT_API_BASE_URL
	)
	const body = JSON.stringify({ task })

	return await fetch(url.toString(), {
		body: body,
		method: 'POST',
		headers,
	})
}

// POST /v1/conversations/:conversation_id
async function continueConversation({
	conversationId,
	parentMessageId,
	task,
	accessToken,
}) {
	const headers = new Headers()
	headers.set('Authorization', `Bearer ${accessToken}`)
	headers.set('Content-Type', 'application/json')

	const url = new URL(
		`/v1/conversations/${conversationId}`,
		process.env.EXPERIMENTAL_CHAT_API_BASE_URL
	)
	const body = JSON.stringify({ task, parentMessageId })

	return await fetch(url.toString(), {
		body: body,
		method: 'POST',
		headers,
	})
}
