/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'
import { GetStaticPropsContext } from 'next'
import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
import { Pluggable } from 'unified'
import renderPageMdx from '../render-page-mdx'
import {
	getNodeFromPath,
	getPathsFromNavData,
	resolveNavData,
	stripVersionFromPathParams,
} from './utils'
import { DEFAULT_PARAM_ID, REMARK_ARRAY_ERROR } from '../consts'
import {
	DataLoader,
	DataLoaderOpts,
	RemarkPlugins,
	RemarkPluginsArray,
} from './types'
import { ParsedUrlQuery } from 'querystring'

interface FileSystemLoaderOpts extends DataLoaderOpts {
	navDataFile: string
	localContentDir: string
	mainBranch?: string // = 'main',
	remarkPlugins?: RemarkPlugins
	rehypePlugins?: Pluggable[]
	scope?: Record<string, unknown>
	githubFileUrl?: (path: string) => string
}

interface LoadStaticPropsReturn {
	currentPath: string
	frontMatter: Record<string, unknown>
	githubFileUrl: string
	mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>
	navData: unknown[]
	versions: unknown[]
}

export default class FileSystemLoader implements DataLoader {
	constructor(public opts: FileSystemLoaderOpts) {
		this.opts.paramId = this.opts.paramId ?? DEFAULT_PARAM_ID
		this.opts.mainBranch = this.opts.mainBranch ?? 'main'
		this.opts.scope = this.opts.scope ?? {}
		this.opts.remarkPlugins = this.opts.remarkPlugins ?? []
		this.opts.rehypePlugins = this.opts.rehypePlugins ?? []
		this.opts.mdxContentHook =
			this.opts.mdxContentHook ??
			((mdxContent: string, scope: Record<string, unknown>) => mdxContent)
	}

	loadStaticPaths = async (): Promise<
		{ params: Record<string, string[]> }[]
	> => {
		const navData = await resolveNavData(
			this.opts.navDataFile,
			this.opts.localContentDir
		)
		return getPathsFromNavData(navData, this.opts.paramId)
	}

	loadStaticProps = async ({
		params,
	}: GetStaticPropsContext): Promise<LoadStaticPropsReturn> => {
		let remarkPlugins: RemarkPluginsArray = []

		// given: v0.5.x (latest), v0.4.x, v0.3.x
		const [versionFromPath, paramsNoVersion] = stripVersionFromPathParams(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			params![this.opts.paramId!] as string[]
		)

		// We support passing in a function to remarkPlugins, which gets the parameters of the current page
		if (typeof this.opts.remarkPlugins === 'function') {
			remarkPlugins = this.opts.remarkPlugins(
				paramsNoVersion as unknown as ParsedUrlQuery,
				versionFromPath
			)
			if (!Array.isArray(remarkPlugins)) {
				throw new Error(REMARK_ARRAY_ERROR)
			}
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we default this in the constructor, so it must be defined
			remarkPlugins = this.opts.remarkPlugins!
		}

		const mdxRenderer = (mdx: string) =>
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
		// Build the currentPath from page parameters
		const currentPath =
			params && this.opts.paramId && params[this.opts.paramId]
				? (paramsNoVersion as string[]).join('/')
				: ''
		//  Read in the nav data, and resolve local filePaths
		const navData = await resolveNavData(
			this.opts.navDataFile,
			this.opts.localContentDir
		)
		//  Get the navNode that matches this path
		const navNode = getNodeFromPath(
			currentPath,
			navData,
			this.opts.localContentDir
		)
		//  Read in and process MDX content from the navNode's filePath
		const mdxFile = path.join(process.cwd(), navNode.filePath)
		const mdxString = await fs.promises.readFile(mdxFile, 'utf8')
		const { mdxSource, frontMatter } = await mdxRenderer(mdxString)

		// Construct the githubFileUrl, used for "Edit this page" link
		const normalizedFilePath = navNode.filePath
			.split(path.sep)
			.join(path.posix.sep)

		const githubFileUrl = this.opts.githubFileUrl
			? this.opts.githubFileUrl(normalizedFilePath)
			: `https://github.com/hashicorp/${this.opts.product}/blob/${this.opts.mainBranch}/website/${normalizedFilePath}`

		// Return all the props
		return {
			versions: [],
			currentPath,
			frontMatter,
			githubFileUrl,
			mdxSource,
			navData,
		}
	}
}
