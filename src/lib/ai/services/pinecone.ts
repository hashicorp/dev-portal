// PineconeDB
import { PineconeClient as _PineconeClient } from '@pinecone-database/pinecone'

import type { Vector } from '@pinecone-database/pinecone'
export type { Vector } from '@pinecone-database/pinecone'
import type { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch'

import type { DBClient } from './db.interface'

export async function getPineconeClient() {
	// todo: init once
	const pinecone = new _PineconeClient()
	await pinecone.init({
		environment: process.env.PINECONE_ENVIRONMENT!,
		apiKey: process.env.PINECONE_API_KEY!,
	})
	return pinecone
}

export class PineconeClient implements DBClient {
	client: _PineconeClient
	// @ts-expect-error - ignore private identifier error
	#namespace: string | undefined = undefined
	// @ts-expect-error - ignore private identifier error
	#index: VectorOperationsApi | undefined = undefined

	constructor(client: _PineconeClient) {
		this.client = client
	}

	/** An async-constructor helper */
	static async init() {
		const client = await getPineconeClient()
		return new PineconeClient(client)
	}

	namespace(value: string) {
		this.#namespace = value
		return this
	}

	index(indexName: string) {
		this.#index = this.client.Index(indexName)
		return this
	}

	async query({ vector }: { vector: number[] }) {
		if (!this.#index) {
			throw new Error('index not set. Please call Pinecone.index() first.')
		}

		const queryResponse = await this.#index.query({
			queryRequest: {
				namespace: this.#namespace ?? undefined,
				vector,
				topK: 10,
				includeMetadata: true,
				includeValues: false, // we don't need the actual vectors, just the text, which is stored in metadata
			},
		})

		return (
			queryResponse.matches?.map((match) => ({
				id: match.id,
				metadata: (match.metadata ?? {}) as Record<string, string>,
			})) ?? []
		)
	}

	/** returns upserted count */
	async upsert({ vectors }: { vectors: Vector[] }) {
		if (!this.#index) {
			throw new Error('index not set. Please call Pinecone.index() first.')
		}
		const upsertResult = await this.#index.upsert({
			upsertRequest: {
				vectors,
				namespace: this.#namespace,
			},
		})
		return upsertResult.upsertedCount!
	}

	async resetIndex(indexName: string) {
		console.log('deleting...', indexName)
		await this.client.deleteIndex({
			indexName,
		})

		console.log('recreating...')
		await this.client.createIndex({
			createRequest: {
				dimension: 1536,
				name: indexName,
				metric: 'cosine',
			},
		})
	}
}
