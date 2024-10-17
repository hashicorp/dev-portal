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

/**
 * This env is set for local docker previews by a custom asset server,
 * otherwise we use the content api for previews / prod.
 * This is used for local and deploy preview modes from the `tutorials` repo.
 *
 * NOTE: this ASSET_API_ENDPOINT is intended for tutorials content only.
 * It is not expected to be used with docs content.
 */
const ASSET_API_ENDPOINT =
	process.env.ASSET_API_ENDPOINT ||
	`${process.env.MKTG_CONTENT_DOCS_API}/api/assets`

/**
 * @TODO write tests for this plugin - https://app.asana.com/0/1202097197789424/1204921235104809
 *
 * This Plugin rewrites src asset paths for tutorials content. With tutorials, images live in a
 * /public directory in the tutorials repository.
 *
 * For dev portal previews / prod, we source these image paths from the mktg-content-api,
 * which acts as a proxy-cache in front of the GitHub CDN. For tutorials repo previews, we use the PREVIEW_BRANCH env
 * to target the correct path via the GitHub CDN. See: https://github.com/hashicorp/mktg-content-workflows/blob/main/api/assets.ts
 *
 * For authors working on content locally, we spin up a custom asset server within docker
 * and the paths are served 1-1.
 */
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

			const isVercelBuild =
				process.env.VERCEL_ENV === 'production' ||
				process.env.VERCEL_ENV === 'preview'
			const newUrl = new URL(ASSET_API_ENDPOINT)
			// The second arg, the dev-portal url, is arbitrary to satisfy the URL constructor
			const { hash, pathname } = new URL(
				node.url,
				'https://developer.hashicorp.com'
			)

			/**
			 * For themed images, authors append their image urls
			 * with the hash #{dark|light}-theme-only
			 */
			if (hash) {
				newUrl.hash = hash
			}

			/**
			 * For the local tutorials repo workflow, a custom asset server hosts
			 * the images, so we don't adjust the path.
			 */
			if (!isVercelBuild && process.env.TUTORIALS_LOCAL === 'true') {
				newUrl.pathname = path.join(newUrl.pathname, pathname)
			} else {
				/**
				 * If not building for local tutorials workflow, we can assume the assets are pushed up
				 * to git and can be served via the GH CDN.
				 * */
				const params = newUrl.searchParams

				// for /tutorials previews, we pass the branchname as an env via gh workflow
				// otherwise, for prod, we reference images in the main branch
				const branchName = process.env.PREVIEW_BRANCH || 'main'

				// assumes tutorials has a /public dir where images live
				const assetPath = path.join('public', pathname)

				params.set('product', 'tutorials')
				params.set('version', branchName)
				params.set('asset', assetPath)
			}

			node.url = newUrl.toString()

			return [node]
		})
	}
}
