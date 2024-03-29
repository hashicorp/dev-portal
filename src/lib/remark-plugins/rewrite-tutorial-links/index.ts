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
import { getTutorialMap } from './utils'
import { rewriteTutorialsLink } from './utils/rewrite-tutorials-link'

let TUTORIAL_MAP

export const rewriteTutorialLinksPlugin: Plugin = (
	options: RewriteTutorialLinksPluginOptions = {}
) => {
	const { contentType = DEFAULT_CONTENT_TYPE, tutorialMap } = options
	return async function transformer(tree) {
		// Load the tutorial map if it's not provided
		TUTORIAL_MAP = tutorialMap ?? (await getTutorialMap())

		// Visit link and defintion node types
		visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			node.url = rewriteTutorialsLink(node.url, TUTORIAL_MAP, contentType)
		})
	}
}
