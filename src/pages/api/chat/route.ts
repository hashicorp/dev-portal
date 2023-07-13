import { OpenAIClient } from 'lib/ai/services/openai'
import { PineconeClient } from 'lib/ai/services/pinecone'

export const config = {
	runtime: 'experimental-edge',
}

import { z } from 'zod'
import { type NextRequest } from 'next/server'

export default async function handler(req: NextRequest) {
	console.log(`[${req.method}] ${req.url}`)

	switch (req.method) {
		// GET is a technically a no-op, but it's useful for testing
		// curl http://localhost:3000/api/chat/route
		case 'GET': {
			const encoder = new TextEncoder()

			// mock could be something like `APIResponse<Stream<Completion>>` from 	"openai": "^4.0.0-beta.4",
			const mock = Array.from({ length: 100 }, () => 'Hello World')
			const readableStream = new ReadableStream({
				async start(controller) {
					for await (const part of mock) {
						const byteArray = encoder.encode(part)
						controller.enqueue(byteArray)
					}
					controller.close()
				},
			})

			return new Response(readableStream, {
				headers: { 'Content-Type': 'text/html; charset=utf-8' },
			})
		}

		// curl -X POST -H "Content-Type: application/json" -d '{"task": "give me two paragraphs of nonsense"}' http://localhost:3000/api/chat/route
		case 'POST': {
			const bodySchema = z.object({
				// task is an arbitrary field name
				task: z.string(),
			})

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

const createPrompt = (
	question: string,
	ctx: string
) => `1. Use the provided context delimited by triple quotes to answer a user's question.
2. Site the most relevant document's URL.
3. Return the response in markdown format.

"""
${ctx}
"""

Question: ${question}
`
