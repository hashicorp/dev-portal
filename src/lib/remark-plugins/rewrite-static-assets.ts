/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * This is based on mktg-content-workflow's docs transformers
 * https://github.com/hashicorp/mktg-content-workflows/blob/main/shared/transforms/rewrite-static-assets.ts
 *
 * It rewrites image paths to source from the tutorials repository
 * via the GitHub CDN, which is provided by the assets API in mtkg-content-workflows
 */

import path from 'path'
import flatMap from 'unist-util-flatmap'
import { is } from 'unist-util-is'

// types
import { Plugin } from 'unified'
import { Node } from 'unist'
import { Image, Definition } from 'mdast'

// This env is set for local docker previews by a custom asset server,
// otherwise we use the content api for previews / prod
const ASSET_API_ENDPOINT =
	process.env.ASSET_API_ENDPOINT || `${process.env.MKTG_CONTENT_API}/api/assets`

export const rewriteStaticAssetsPlugin: Plugin = () => {
	return function transformer(tree) {
		return flatMap(tree, (node: Node) => {
			if (!is<Image>(node, 'image') && !is<Definition>(node, 'definition')) {
				return [node]
			}
			/**
			 * Hotfix: the Definition node could be used by an image or link reference
			 * This regex checks if the path starts with /img or /public/img. While
			 * a brittle check, it prevents links references from breaking.
			 *
			 * We need to follow with a more comprehensive, long-term solution
			 * to selectively delineate image from link.
			 */
			const regex = /^\/img|\/public\/img/ // Ensures non-image links aren't rewritten
			const isImagePath = regex.test(node.url)

			if (!isImagePath || !path.isAbsolute(node.url)) {
				return [node]
			}

			const newUrl = getNewImageUrl(node.url)

			if (typeof newUrl === 'string') {
				node.url = newUrl
			}

			return [node]
		})
	}
}

/**
 * For tutorials content, images live in a /public directory in the tutorials repository
 *
 * For dev portal previews / prod, we source these image paths from the mktg-content-api,
 * which uses the GitHub API. For tutorials repo previews, we use the PREVIEW_BRANCH env
 * to target the correct path via the GitHub API.
 *
 * For authors working on content locally, we spin up a custom asset server within docker
 * and the paths are served 1-1.
 */
export function getNewImageUrl(url: string): string | undefined {
	// const isVercelBuild =
	// 	process.env.VERCEL_ENV === 'production' ||
	// 	process.env.VERCEL_ENV === 'preview'
	const isVercelBuild = true
	const newUrl = new URL(ASSET_API_ENDPOINT)

	/**
	 * If building in a vercel preview, we can assume the assets are pushed up
	 * to git and can be served via the GH CDN.
	 * */
	if (isVercelBuild) {
		const params = newUrl.searchParams

		// for /tutorials previews, we pass the branchname as an env via gh workflow
		// otherwise, for prod, we reference images in the main branch
		const branchName = process.env.PREVIEW_BRANCH || 'staging'

		// assumes tutorials has a /public dir where images live
		const assetPath = path.join('public', url)

		params.set('product', 'tutorials')
		params.set('version', branchName)
		params.set('asset', assetPath)
	} else if (process.env.HASHI_ENV === 'development') {
		// Otherwise, pass the unchanged path to a custom asset server for tutorials repo local dev.
		// In the docker compose file in the tutorials repo, this HASHI_ENV is set for the frontend
		// This line should only ever run when the local tutorials workflow is going
		newUrl.pathname = path.join(newUrl.pathname, url)
	} else {
		/**
		 * @TODO Fix local tutorials images for dev-portal
		 *
		 * Tutorial images are currently broken for local development in dev-portal
		 * Since the local files aren't available.
		 *
		 * For local dev in dev-portal, we should just use the mktg-content-api, like in prod / previews
		 */
		return url
	}

	return newUrl.toString()
}
