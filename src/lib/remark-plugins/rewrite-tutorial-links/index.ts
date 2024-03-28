/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * This plugin writes urls for learn tutorial content that reference other
 * learn tutorials or collections.
 *
 * If the link references a tutorial or collection that is included in the
 * beta-product list, this rewrites the link path to be relative to dev dot.
 *
 * All other tutorial and collection links are rewritten to point externally
 * to production learn.hashicorp.com
 *
 * ONCE DEV PORTAL IS GENERALLY AVAILBLE, this plugin will be deprecated
 * as all written internal links within the content will be updated in the
 * content itself. This is an interim workaround while we have a divergent state
 * during beta.
 *
 * Please refer to this diagram for full details on remapping
 * https://whimsical.com/url-remaps-TqyEmfG6gYyiAZR1HWSWEL
 */

import { Link, Definition } from 'mdast'
import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { RewriteTutorialLinksPluginOptions } from './types'
import { DEFAULT_CONTENT_TYPE } from './constants'
import { rewriteTutorialsLink } from './utils/rewrite-tutorials-link'

export const rewriteTutorialLinksPlugin: Plugin = (
	options: RewriteTutorialLinksPluginOptions = {}
) => {
	const { contentType = DEFAULT_CONTENT_TYPE, tutorialMap } = options
	return async function transformer(tree) {
		// Throw an error if the tutorial map is not provided. Due to how
		// Remark plugins are typed, we can't have required parameters.
		if (!tutorialMap) {
			throw new Error('[rewriteTutorialLinksPlugin] tutorialMap is required')
		}

		// Visit link and defintion node types
		visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			node.url = rewriteTutorialsLink(node.url, tutorialMap, contentType)
		})
	}
}
