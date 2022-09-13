import RemoteContentLoader from '@hashicorp/react-docs-page/server/loaders/remote-content'
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

/**
 * react-query-like BuildCache wrapper which accepts a keyFn and queryFn and handles cache interaction
 */
export function AsyncBuildCache({ storeName, keyFn, queryFn }) {
	const cache = BuildCache(storeName)

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

/**
 * Wrapper around RemoteContentLoader which uses a local cache layer to cache the output of loadStaticProps. Intended for use in a Vercel CI environment.
 */
export class CachedRemoteContentLoader implements RemoteContentLoader {
	static latestShaBySlug = new Map()

	loader: RemoteContentLoader

	constructor(opts) {
		this.loader = new RemoteContentLoader(opts)
	}

	get opts() {
		return this.loader.opts
	}

	loadStaticPaths = () => this.loader.loadStaticPaths()

	loadStaticProps = async (ctx) => {
		const cache = AsyncBuildCache({
			storeName: 'docs-mdx-cache',
			keyFn: async (productSlug, ...keyParts) => {
				let latestSha =
					CachedRemoteContentLoader.latestShaBySlug.get(productSlug)
				if (!latestSha) {
					latestSha = await fetch(
						`https://content.hashicorp.com/api/content/${productSlug}/version-metadata/latest`
					)
						.then((res) => res.json())
						.then((res) => res.result.sha)

					CachedRemoteContentLoader.latestShaBySlug.set(productSlug, latestSha)
				}

				return [latestSha, productSlug, ...keyParts]
			},
			queryFn: () => this.loader.loadStaticProps(ctx),
		})

		return cache.get(
			this.opts.product,
			this.opts.basePath,
			...((ctx.params.page || []) as string[])
		)
	}
}
