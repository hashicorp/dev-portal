import RemoteContentLoader from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { AsyncBuildCache } from './build-cache'

/**
 * Wrapper around RemoteContentLoader which uses a cache layer to cache the output of loadStaticProps. Intended for use in a Vercel CI environment.
 */
export class CachedRemoteContentLoader implements RemoteContentLoader {
	static latestShaBySlug = new Map()

	loader: RemoteContentLoader

	constructor(opts: RemoteContentLoader['opts']) {
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
