import { get } from '@vercel/edge-config'

import { OpenAIClient } from 'lib/ai/services/openai'
import { PineconeClient } from 'lib/ai/services/pinecone'

import { fetchUserInfo, type UserInfoSchema } from 'lib/auth/fetch-user-info'

export const config = {
	runtime: 'experimental-edge',
}

import { z } from 'zod'
import { type NextRequest } from 'next/server'

const bodySchema = z.object({
	task: z.string(),
})

const edgeConfigSchema = z.object({
	allowlist: z.record(z.boolean()),
})
type EdgeConfigSchema = z.infer<typeof edgeConfigSchema>

export default async function handler(req: NextRequest) {
	console.log(`[${req.method}] ${req.url}`)
	const headers = req.headers
	const authorization = headers.get('authorization')
	const jwt = authorization.split(' ')[1]

	let userInfo: UserInfoSchema
	try {
		// fetchUserInfo internally validates the JWT
		userInfo = await fetchUserInfo(jwt)
	} catch (e) {
		return new Response('Forbidden', {
			status: 401,
		})
	}

	// may throw...
	const allowlist: EdgeConfigSchema['allowlist'] = await get('allowlist')

	if (!allowlist[userInfo.email]) {
		return new Response('403 Feature not enabled', { status: 403 })
	}

	return mockStream()

	switch (req.method) {
		// GET is a technically a no-op, but it's useful for testing
		// curl http://localhost:3000/api/chat/route
		case 'GET': {
			return mockStream()
		}

		// curl -X POST -H "Content-Type: application/json" -d '{"task": "give me two paragraphs of nonsense"}' http://localhost:3000/api/chat/route
		case 'POST': {
			// ensure the incoming request body adheres to a schema
			const parsedBody = bodySchema.safeParse(await req.json())
			// reject if it doesn't
			if (parsedBody.success === false) {
				// @ts-expect-error - safeParse() return type is not working
				return new Response(parsedBody.error, {
					headers: { 'Content-Type': 'application/json' },
				})
			}
			// otherwise proceed; parsedBody is now typed

			// create openai and pinecone clients
			const openai = new OpenAIClient()
			// 1. creates a vector embedding of the incoming question
			// 3. creates a completion at the end
			const pinecone = await PineconeClient.init()
			// 2. queries pinecone for the most similar questions, via vector commparison

			const task = parsedBody.data.task

			const vectorEmbedding = await openai.createEmbedding({
				input: task,
			})

			// query pinecone for the most similar questions
			const matchingVectors = await pinecone
				.index(process.env.INDEX_NAME)
				.namespace(process.env.INDEX_NAMESPACE)
				.query({ vector: vectorEmbedding })

			console.log('matchingVectors', matchingVectors.length)

			// create the context to be passed to OpenAI completions
			const ctx = matchingVectors
				.map((match) => ({
					summary: match.metadata?.summary,
					text: match.metadata?.text,
					id: match.id,
				}))
				.map((c, i) =>
					[
						`Document ${i}: ${c.id}\n`,
						`Summary: ${c.summary.trim()}\n`,
						`URL: [${c.id}](${c.id})\n`,
					].join('')
				) // convert the most similar embedding vectors to summary & url pairs
				.join('\n') // separate each summary&url pair with a newline

			const prompt = createPrompt(task, ctx)
			console.log(prompt)
			const completion = await openai.createCompletion({ prompt })

			// https://github.com/openai/openai-node/discussions/182#discussioncomment-6304709
			const encoder = new TextEncoder()
			const readableStream = new ReadableStream({
				async start(controller) {
					for await (const part of completion) {
						// console.log(part.choices[0].text)
						const byteArray = encoder.encode(part.choices[0].text)
						controller.enqueue(byteArray)
					}
					controller.close()
				},
			})

			return new Response(readableStream, {
				headers: { 'Content-Type': 'text/html; charset=utf-8' },
			})
		}
	}
}

function createPrompt(question: string, ctx: string) {
	return `1. Use the provided context delimited by triple quotes to answer a user's question.
2. Site the most relevant document's URL.
3. Return the response in markdown format.

"""
${ctx}
"""

Question: ${question}
`
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

function mockStream() {
	const encoder = new TextEncoder()

	const mock = toRandomChunks(MOCK_TEXT)
	const readableStream = streamFromIterable(mock, async (c) => {
		await sleep(50)
		return c
	})

	return new Response(readableStream, {
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
	})
}

// create random sized chunks from a string
// chunk size between 1 and 10 characters
function toRandomChunks(text: string): Array<string> {
	const chunks: string[] = []
	let i = 0
	while (i < text.length) {
		const chunkSize = Math.floor(Math.random() * 10) + 1
		chunks.push(text.slice(i, i + chunkSize))
		i += chunkSize
	}
	return chunks
}

/** response for "what is boundary?" */
const MOCK_TEXT =
	'Boundary is an identity-aware proxy that simplifies and secures least-privileged access to cloud infrastructure. It enables single sign-on to target services and applications via external identity providers, provides just-in-time network access to private resources, enables passwordless access with dynamic credentials via HashiCorp Vault, automates discovery of new target systems, records and manages privileged sessions, and standardizes access workflow with a consistent experience for any type of infrastructure across any provider. For more information, please refer to [What is Boundary](/boundary/docs/overview/what-is-boundary).'

function streamFromIterable<T = any>(
	iterable: Iterable<T>,
	processChunk: (part: T) => string
) {
	const encoder = new TextEncoder()
	return new ReadableStream({
		async start(controller) {
			for await (const chunk of iterable) {
				// processChunk might look like: (part) => part.choices[0].text
				const byteArray = encoder.encode(await processChunk(chunk))
				controller.enqueue(byteArray)
			}
			controller.close()
		},
	})
}
