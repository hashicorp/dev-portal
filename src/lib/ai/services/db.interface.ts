type QueryInput = {
	vector: number[]
}
type QueryOutput = {
	id: string
	metadata: Record<string, string>
}[]

type UpsertInput = {
	vectors: Vector[]
}

interface Vector {
	id: string
	values: number[]
	metadata: Record<string, string>
}

/**
 * A generic interface for a database client.
 *
 * As long as database clients implement this interface,
 * it decouples the main application logic from provider-specific details.
 *
 * This way we can easily swap out the database client without
 * sweeping refactors on the rest of the application.
 *
 * Database providers include:
 * - [Pinecone](https://www.pinecone.io/)
 * - [Milvus](https://milvus.io/)
 * ...
 */
export interface DBClient {
	query(input: QueryInput): Promise<QueryOutput>
	upsert(input: UpsertInput): Promise<number>
}
