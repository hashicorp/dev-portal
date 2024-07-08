/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Plugin } from 'unified'
import { Image } from 'mdast'
import { isAbsoluteUrl } from 'next/dist/shared/lib/utils'
import { visit } from 'unist-util-visit'
import { HVD_FINAL_IMAGE_ROOT_DIR } from '@scripts/extract-hvd-content'

function convertToHVDPathUrl(nodeUrl: string): string {
	if (isAbsoluteUrl(nodeUrl)) {
		return nodeUrl
	}

	if (process.env.IS_CONTENT_PREVIEW) {
		return nodeUrl
	}

	return `/${HVD_FINAL_IMAGE_ROOT_DIR}${nodeUrl}`
}

export const rewriteStaticHVDAssetsPlugin: Plugin = () => {
	return function transformer(tree) {
		// @ts-expect-error Types Should be correct here
		visit<Image>(tree, ['image', 'definition'], (node) => {
			node.url = convertToHVDPathUrl(node.url)
		})
	}
}
