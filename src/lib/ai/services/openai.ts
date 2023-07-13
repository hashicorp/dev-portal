// Open AI
import { OpenAI } from 'openai'

export function getOpenAIClient() {
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY!,
	})
	return openai
}

export class OpenAIClient {
	openai: OpenAI

	constructor() {
		this.openai = getOpenAIClient()
	}

	createEmbedding = async ({ input }: { input: string }) => {
		const createEmbeddingResponse = await this.openai.embeddings.create({
			model: 'text-embedding-ada-002',
			input,
		})
		return createEmbeddingResponse.data[0].embedding
	}

	createCompletion = async ({ prompt }: { prompt: string }) => {
		const createCompletionResponse = await this.openai.completions.create({
			prompt,
			model: 'text-davinci-003',
			max_tokens: 2048, // 4096 | 2048,
			temperature: 0.1,
			// see if stream: true poses any problems
			stream: true,
		})
		// Use this if stream: false
		// return createCompletionResponse.choices[0].text
		return createCompletionResponse
	}
}
