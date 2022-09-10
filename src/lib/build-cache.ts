import { FileStore, stableHash } from 'metro-cache'
import path from 'path'

/**
 * Cache the output of next-mdx-remote/serialize on disk for use between builds.
 */
export function BuildCache(storeName) {
	const store = new FileStore({
		root: path.join(process.cwd(), 'node_modules', '.cache', storeName),
	})

	return {
		/**
		 * Retrieve an item from the cache
		 */
		async get(key) {
			const hash = Buffer.from(stableHash(key))
			return store.get(hash)
		},
		/**
		 * Store an item in the cache
		 */
		async set(key, value) {
			const hash = Buffer.from(stableHash(key))
			return store.set(hash, value)
		},
	}
}
