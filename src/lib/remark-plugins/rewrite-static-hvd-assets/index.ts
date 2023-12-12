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

// types
import { Plugin } from 'unified'
import { Image } from 'mdast'
import { isAbsoluteUrl } from 'next/dist/shared/lib/utils'
import { visit } from 'unist-util-visit'
import { HVD_FINAL_IMAGE_ROOT_DIR } from '../../../../scripts/extract-hvd-content'

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
 *
 */

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
