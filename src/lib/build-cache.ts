import { FileStore, stableHash } from 'metro-cache'
import path from 'path'

type AsyncBuildCacheOptions<QueryResult> = {
	storeName: string
	keyFn(...args: unknown[]): Promise<unknown>
	queryFn(): Promise<QueryResult>
}

type AsyncBuildCacheResult<QueryResult> = {
	get(...args: unknown[]): Promise<QueryResult>
}

/**
 * Primitive to create a build-time cache, with items stored in `node_modules/.cache`.
 */
export function BuildCache<CacheItem>(storeName: string) {
	const store = new FileStore({
		root: path.join(process.cwd(), 'node_modules', '.cache', storeName),
	})

	return {
		/**
		 * Retrieve an item from the cache
		 */
		async get(key): Promise<CacheItem> {
			const hash = Buffer.from(stableHash(key))
			return store.get(hash)
		},
		/**
		 * Store an item in the cache
		 */
		async set(key, value: CacheItem): Promise<void> {
			const hash = Buffer.from(stableHash(key))
			return store.set(hash, value)
		},
	}
}

/**
 * react-query-like BuildCache wrapper which accepts a keyFn and queryFn, and implicitly handles cache interaction
 */
export function AsyncBuildCache<QueryResult>({
	storeName,
	keyFn,
	queryFn,
}: AsyncBuildCacheOptions<QueryResult>): AsyncBuildCacheResult<QueryResult> {
	const cache = BuildCache<QueryResult>(storeName)

	return {
		async get(...args) {
			const key = await keyFn(...args)
			let result = await cache.get(key)

			if (result) {
				console.log(`[build-cache:${storeName}] cache hit for ${key}`)

				return result
			}

			console.log(`[build-cache:${storeName}] cache miss for ${key}`)

			result = await queryFn()

			await cache.set(key, result)

			return result
		},
	}
}
