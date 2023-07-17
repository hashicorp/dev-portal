/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { Image, Root } from 'mdast'
import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import probe from 'probe-image-size'

/**
 * This plugin injects image dimensions for images whose src references the mktg-content-api.
 * This only applies to tutorials currently, for docs content this is done via mktg-content-workflows
 * https://github.com/hashicorp/mktg-content-workflows/blob/main/shared/transforms/rewrite-site-static-assets.ts
 */
export const remarkPluginInjectImageDimensions: Plugin = (): Transformer => {
	return async function transformer(tree: Root) {
		const imageNodesForDimensions = []
		visit(tree, 'image', (node: Image) => {
			/**
			 * Only transform nodes using the mktg-content-api src.
			 * This is dependent on `rewriteStaticAssets` running before this plugin
			 * to transform the src URLs from local file paths to mktg-content-api urls
			 * See: src/lib/remark-plugins/rewrite-static-tutorials-assets/index.ts
			 */
			if (node.url.startsWith(process.env.MKTG_CONTENT_API)) {
				imageNodesForDimensions.push(node)
			}
		})
		/**
		 * If width and height aren't defined via props by the author, we attempt
		 * to calculate the file dimensions and append those props to the source string
		 *
		 * This involves async tasks so is handled in a separate loop from the 'visit'
		 * where async isn't supported. Taken from suggestion in this issue
		 *  https://github.com/syntax-tree/unist-util-visit-parents/issues/8#issuecomment-1413405543
		 */
		const promises = imageNodesForDimensions.map(async (node: Image) => {
			const url = await getUrlWithDimensions(node.url)
			if (url) {
				node.url = url
			}
		})
		await Promise.all(promises)
	}
}

export async function getUrlWithDimensions(
	nodeUrl: string
): Promise<string | undefined> {
	try {
		const url = new URL(nodeUrl)
		// if width / height already defined in url, return early
		if (url.searchParams.get('width') && url.searchParams.get('height')) {
			return nodeUrl
		}

		const dimensions = await probe(nodeUrl)

		if (dimensions) {
			url.searchParams.append('width', dimensions.width)
			url.searchParams.append('height', dimensions.height)
			return url.toString()
		}
	} catch (e) {
		/**
		 * Catching all errors here to prevent urls from breaking
		 * if not found or formatted improperly
		 */
		console.error(
			`[remarkPluginInjectImageDimensions] Unable to calculate dimensions for image path: ${nodeUrl}` +
				e
		)
		return
	}
}
