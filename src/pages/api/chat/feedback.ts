import { type NextRequest, type NextFetchEvent } from 'next/server'
import { z } from 'zod'

export const config = {
	runtime: 'experimental-edge',
}

// POST body payload
const bodySchema = z.object({
	conversationId: z.string(),
	messageId: z.string(),
	text: z
		.string()
		.transform((e) => e.trim())
		.optional(),
	rating: z.number().min(-1).max(1).optional(),
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
			const { conversationId, messageId, rating, text } = parsedBody.data

			const res = await createMessageFeedback(
				{
					conversationId,
					messageId,
					accessToken: jwt,
				},
				{ rating, text }
			)
			const data = await res.json()

			return new Response(data, { status: res.status })
		}
	}
}

// POST /v1/conversations/:conversation_id/messages/:message_id/feedback
async function createMessageFeedback(
	{ conversationId, messageId, accessToken },
	{ rating, text }
) {
	const headers = new Headers()
	headers.set('Authorization', `Bearer ${accessToken}`)
	headers.set('Content-Type', 'application/json')

	const url = new URL(
		`/v1/conversations/${conversationId}/messages/${messageId}/feedback`,
		process.env.EXPERIMENTAL_CHAT_API_BASE_URL
	)

	return fetch(url.toString(), {
		body: JSON.stringify({ rating, text }),
		method: 'POST',
		headers,
	})
}
