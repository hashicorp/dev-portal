import { FileStore, stableHash } from 'metro-cache'
import { createClient } from '@vercel/remote'
import type { RemoteClient } from '@vercel/remote'
import path from 'path'
import crypto from 'crypto'

let remoteClient: RemoteClient
function getRemoteClient() {
	if (remoteClient) {
		return remoteClient
	}

	remoteClient = createClient(process.env.VERCEL_ARTIFACTS_TOKEN, {
		teamId: process.env.VERCEL_TEAM_ID,
		product: 'hashicorp-content-compiler',
	})

	return remoteClient
}

function verboseLog(...rest) {
	if (process.env.VERBOSE_CACHE_LOGS) {
		console.log(...rest)
	}
}

function hashKey(key) {
	return crypto.createHash('md5').update(JSON.stringify(key)).digest('hex')
}

function VercelRemoteCacheStore<CacheItem>({
	name = '',
	serialize = JSON.stringify,
	deserialize = JSON.parse,
} = {}) {
	const remote = getRemoteClient()

	return {
		async get(key): Promise<CacheItem | null> {
			const hash = hashKey(key)

			// TODO: we aren't using the exists check to avoid a round-trip to Vercel's API. Need to validate that there isn't some other downside to forgoing the exists check and instead catching the error.
			// const exists = await remote.exists(hash).send()

			// if (!exists) {
			// 	return null
			// }

			try {
				let start = Date.now()
				const value = String(await remote.get(hash).buffer())
				let duration = Date.now() - start
				console.log(`[remote-cache] fetch duration: ${duration}ms`)

				start = Date.now()
				const result = deserialize(value)
				duration = Date.now() - start
				console.log(`[remote-cache] deserialize duration: ${duration}ms`)

				return result
			} catch (err) {
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
export function BuildCache<CacheItem>({ name }: { name: string }) {
	const store = new FileStore({
		root: path.join(process.cwd(), 'node_modules', '.cache', name),
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
		async set(key, value: CacheItem, _duration?: number): Promise<void> {
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
	const cache = BuildCache<QueryResult>({ name: storeName })

	return {
		async get(...args) {
			const key = await keyFn(...args)
			let start = Date.now()
			let result = await cache.get(key)
			let duration = Date.now() - start

			if (result) {
				verboseLog(
					`[build-cache:${storeName}] cache hit for ${key} (${duration}ms)`
				)

				return result
			}

			start = Date.now()
			result = await queryFn()
			duration = Date.now() - start

			verboseLog(
				`[build-cache:${storeName}] cache miss for ${key} (${duration}ms)`
			)

			cache.set(key, result, duration).catch((error) => {
				console.error(error)
			})

			return result
		},
	}
}
