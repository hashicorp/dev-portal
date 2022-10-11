import { FileStore, stableHash } from 'metro-cache'
import { createClient } from '@vercel/remote'
import path from 'path'
import crypto from 'crypto'

const remote = createClient(process.env.VERCEL_TOKEN, {
	teamId: process.env.VERCEL_TEAM_ID,
	product: 'hashicorp-content-compiler',
})

function hashKey(key) {
	return crypto.createHash('md5').update(JSON.stringify(key)).digest('hex')
}

function VercelRemoteCacheStore<CacheItem>({
	serialize = JSON.stringify,
	deserialize = JSON.parse,
} = {}) {
	return {
		async get(key): Promise<CacheItem | null> {
			const hash = crypto
				.createHash('md5')
				.update(JSON.stringify(key))
				.digest('hex')

			// const exists = await remote.exists(hash).send()

			// if (!exists) {
			// 	return null
			// }

			try {
				const value = String(await remote.get(hash).buffer())
				return deserialize(value)
			} catch (err) {
				console.log('remote.get error', err)
				// TODO: handle the error
				return null
			}
		},
		async set(key, value: CacheItem, duration?: number): Promise<void> {
			const hash = hashKey(key)
			const serializedValue = serialize(value)

			// @ts-expect-error -- the types are wrong
			return remote.put(hash, { duration }).buffer(Buffer.from(serializedValue))
		},
	}
}

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
			return store.set(hash, Buffer.from(JSON.stringify(value)))
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
	const cache = VercelRemoteCacheStore<QueryResult>()

	return {
		async get(...args) {
			const key = await keyFn(...args)
			let start = Date.now()
			let result = await cache.get(key)
			let duration = Date.now() - start

			if (result) {
				console.log(
					`[build-cache:${storeName}] cache hit for ${key} (${duration}ms)`
				)

				return result
			}

			start = Date.now()
			result = await queryFn()
			duration = Date.now() - start

			console.log(
				`[build-cache:${storeName}] cache miss for ${key} (${duration}ms)`
			)

			await cache.set(key, result)

			return result
		},
	}
}
