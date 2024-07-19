/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Image } from 'mdast'

/**
 * This is a generator function that returns a remark plugin
 * to rewrite asset urls in markdown files.
 */
export function remarkRewriteImageUrls(args: {
	urlRewriteFn?: (url: string) => string
}): Plugin {
	const { urlRewriteFn = (url) => url } = args

	return function plugin() {
		return function transform(tree) {
			// @ts-expect-error Types Should be correct here
			visit<Image>(tree, 'image', (node) => {
				node.url = urlRewriteFn(node.url)
			})
		}
	}
}
