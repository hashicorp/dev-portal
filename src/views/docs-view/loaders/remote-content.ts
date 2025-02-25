/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Pluggable } from 'unified'
import moize, { Options } from 'moize'
import { GetStaticPropsContext } from 'next'
import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
import {
	fetchNavData,
	fetchVersionMetadataList,
	fetchDocument,
} from './content-api'
import {
	stripVersionFromPathParams,
	getPathsFromNavData,
	normalizeVersion,
} from './utils'
import renderPageMdx from '../render-page-mdx'
import { DEFAULT_PARAM_ID, REMARK_ARRAY_ERROR } from '../consts'
import {
	DataLoader,
	DataLoaderOpts,
	RemarkPlugins,
	RemarkPluginsArray,
} from './types'

interface RemoteContentLoaderOpts extends DataLoaderOpts {
	basePath: string
	/**
	 * In most cases, `basePath` should suffice when resolving nav-data, because
	 * it happens to match the prefix of nav-data file.
	 *
	 * If it does not, `navDataPrefix` will serve as an optional override.
	 */
	navDataPrefix?: string
	enabledVersionedDocs?: boolean
	remarkPlugins?: RemarkPlugins
	rehypePlugins?: Pluggable[]
	mainBranch?: string // = 'main',
	scope?: Record<string, $TSFixMe>
	/**
	 * Allows us to override the default ref from which we fetch the latest content.
	 * e.g. when no version exists in the path, and latestVersionRef was 'my-stable-branch', we would fetch content for `my-stable-branch`
	 */
	latestVersionRef?: string
}

/**
 * TODO: export this from future content-api client
 * @see https://app.asana.com/0/1100423001970639/1201071725174928/f
 */
export type ReleaseStage = 'alpha' | 'beta' | 'rc' | 'stable'
export interface VersionMetadataItem {
	product: string
	ref: string
	version: string
	created_at: string
	display?: string
	sha: string
	isLatest?: boolean
	fullPath: string
	releaseStage: ReleaseStage
}

export interface VersionSelectItem {
	name: string
	label: string
	version: string
	isLatest: boolean
	releaseStage: ReleaseStage
}

interface LoadStaticPropsReturn {
	versions: VersionSelectItem[]
	currentPath: string
	frontMatter: Record<string, unknown>
	githubFileUrl: string
	mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>
	navData: unknown[]
}

const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedFetchVersionMetadataList = moize(
	fetchVersionMetadataList,
	moizeOpts
)

const determineLabel = (option: VersionMetadataItem) => {
	const displayValue = option.display || option.version

	if (option.isLatest) {
		return `${displayValue} (latest)`
	}

	if (
		typeof option.releaseStage !== 'undefined' &&
		option.releaseStage !== 'stable'
	) {
		return `${displayValue} (${option.releaseStage})`
	}

	return displayValue
}

/**
 * Formats a list of version-metadata to,
 * be passed to `<VersionSelect versions={[...]} />`.
 * - Sorts by semver, descending
 */
export function mapVersionList(
	list: VersionMetadataItem[]
): VersionSelectItem[] {
	const versions = list.map((versionOption: VersionMetadataItem) => {
		const { isLatest, version, releaseStage } = versionOption

		return {
			name: isLatest ? 'latest' : version,
			label: determineLabel(versionOption),
			isLatest: isLatest || false,
			releaseStage: releaseStage,
			version,
		}
	})

	return versions
}

export default class RemoteContentLoader implements DataLoader {
	constructor(public opts: RemoteContentLoaderOpts) {
		this.opts.enabledVersionedDocs =
			this.opts.enabledVersionedDocs ??
			process.env.ENABLE_VERSIONED_DOCS?.toString() === 'true'
		this.opts.paramId = this.opts.paramId ?? DEFAULT_PARAM_ID
		this.opts.mainBranch = this.opts.mainBranch ?? 'main'
		this.opts.scope = this.opts.scope ?? {}
		this.opts.remarkPlugins = this.opts.remarkPlugins ?? []
		this.opts.rehypePlugins = this.opts.rehypePlugins ?? []
		this.opts.navDataPrefix = this.opts.navDataPrefix ?? this.opts.basePath
		this.opts.mdxContentHook =
			this.opts.mdxContentHook ??
			((mdxContent: string, scope: Record<string, unknown>) => mdxContent)
	}

	loadStaticPaths = async (): Promise<
		{ params: Record<string, string[]> }[]
	> => {
		const latest: string = this.opts.latestVersionRef ?? 'latest'
		// Fetch and parse navigation data
		const navDataResponse = await fetchNavData(
			this.opts.product,
			this.opts.navDataPrefix!,
			latest
		)
		const navData = navDataResponse.navData
		return getPathsFromNavData(navData, this.opts.paramId)
	}

	loadStaticProps = async ({
		params,
	}: GetStaticPropsContext): Promise<LoadStaticPropsReturn> => {
		// Build the currentPath from page parameters
		const currentPath =
			params && this.opts.paramId && params[this.opts.paramId]
				? (params[this.opts.paramId] as string[]).join('/')
				: ''

		let remarkPlugins: RemarkPluginsArray = []

		// We support passing in a function to remarkPlugins, which gets the parameters of the current page
		if (typeof this.opts.remarkPlugins === 'function') {
			remarkPlugins = this.opts.remarkPlugins(params)
			if (!Array.isArray(remarkPlugins)) {
				throw new Error(REMARK_ARRAY_ERROR)
			}
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we default this in the constructor, so it must be defined
			remarkPlugins = this.opts.remarkPlugins!
		}

		// given: v0.5.x (latest), v0.4.x, v0.3.x
		const [versionFromPath, paramsNoVersion] = stripVersionFromPathParams(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			params![this.opts.paramId!] as string[]
		)

		const mdxRenderer = (mdx) =>
			renderPageMdx(mdx, {
				mdxContentHook: this.opts.mdxContentHook,
				remarkPlugins,
				rehypePlugins: this.opts.rehypePlugins,
				scope: {
					product: this.opts.product,
					version: versionFromPath,
					...this.opts.scope,
				},
			})

		const versionMetadataList: VersionMetadataItem[] =
			await cachedFetchVersionMetadataList(this.opts.product)

		const latestVersion = this.opts.latestVersionRef ?? 'latest'
		let versionToFetch = latestVersion

		if (this.opts.enabledVersionedDocs) {
			versionToFetch =
				versionFromPath === 'latest'
					? latestVersion
					: normalizeVersion(versionFromPath)
		}

		/**
		 * Note: we expect the provided params to not include
		 * a trailing `/index`, as our URLs do not include trailing `/index`.
		 *
		 * The reason for this is that otherwise, we end allowing visitors to see
		 * all category pages at both `/some-doc` and `/some-doc/index` URLs.
		 * We want the latter URL to 404, so we do NOT want to automatically
		 * resolve trailing `/index` from provided URL path parts.
		 */
		const fullPath = [
			'doc',
			versionToFetch,
			this.opts.basePath,
			...paramsNoVersion,
		].join('/')

		const documentPromise = fetchDocument(this.opts.product, fullPath)
		const navDataPromise = fetchNavData(
			this.opts.product,
			this.opts.navDataPrefix!,
			versionToFetch
		)

		const [document, navData] = await Promise.all([
			documentPromise,
			navDataPromise,
		])

		// For non-latest versions
		if (
			versionToFetch !== this.opts.latestVersionRef &&
			versionToFetch !== 'latest'
		) {
			// Remove the first heading from the navData
			if (navData.navData.length > 0 && 'heading' in navData.navData[0]) {
				navData.navData.shift()
			}

			// Remove item if it's an empty path (for non-latest versions, the version is prepended to the path)
			if (
				navData.navData.length > 1 &&
				navData.navData[0].path &&
				navData.navData[0].path.split('/').length > 1
			) {
				navData.navData.splice(0, 1)
			}
		}

		const { mdxSource } = await mdxRenderer(document.markdownSource)
		const frontMatter = document.metadata

		// Construct the githubFileUrl, used for "Edit this page" link

		// Must be serializeable
		let githubFileUrl: string | null = null

		if (document.githubFile) {
			// Link latest version to `main`
			// Hide link on older versions
			const isLatest =
				(versionFromPath === 'latest' && Boolean(this.opts.latestVersionRef)) ||
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				versionMetadataList.find((e) => e.version === document.version)!
					.isLatest

			/**
			 * We want to show "Edit on GitHub" links for public content repos only.
			 * Currently, HCP, PTFE and Sentinel docs are stored in private
			 * repositories.
			 *
			 * Note: If we need more granularity here, we could change this to be
			 * part of `rootDocsPath` configuration in `src/data/<product>.json`.
			 */
			const isPrivateContentRepo = [
				'hcp-docs',
				'sentinel',
				'ptfe-releases',
			].includes(this.opts.product)

			if (isLatest && !isPrivateContentRepo) {
				// GitHub only allows you to modify a file if you are on a branch, not a commit
				githubFileUrl = `https://github.com/hashicorp/${this.opts.product}/blob/${this.opts.mainBranch}/${document.githubFile}`
			}
		}

		// Check if the product is in the unified docs sandbox and migrated
		if (
			process.env.HASHI_ENV === 'unified-docs-sandbox' &&
			__config.flags?.unified_docs_migrated_repos?.find(
				(product) => product === document.product
			)
		) {
			githubFileUrl = `https://github.com/hashicorp/web-unified-docs/blob/${this.opts.mainBranch}/${document.githubFile}`
		}

		return {
			versions: mapVersionList(versionMetadataList),
			currentPath,
			frontMatter,
			githubFileUrl,
			mdxSource,
			navData: navData.navData,
		}
	}
}
