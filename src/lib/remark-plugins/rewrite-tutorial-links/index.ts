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
import {
	getIsRewriteableDocsLink,
	getTutorialMap,
	rewriteExternalLearnLink,
	rewriteExternalDocsLink,
	getIsExternalLearnLink,
} from './utils'

let TUTORIAL_MAP

const DEFAULT_CONTENT_TYPE = 'tutorials'

interface RewriteTutorialLinksPluginOptions {
	contentType?: 'docs' | 'tutorials'
	tutorialMap?: Record<string, string>
}

export const rewriteTutorialLinksPlugin: Plugin = (
	options: RewriteTutorialLinksPluginOptions = {}
) => {
	const { contentType = DEFAULT_CONTENT_TYPE, tutorialMap } = options
	return async function transformer(tree) {
		// Load the tutorial map if it's not provided
		TUTORIAL_MAP = tutorialMap ?? (await getTutorialMap())

		// Visit link and defintion node types
		visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			handleRewriteTutorialsLink(node, contentType)
		})
	}
}

function handleRewriteTutorialsLink(
	node: Link | Definition,
	contentType: RewriteTutorialLinksPluginOptions['contentType'] = DEFAULT_CONTENT_TYPE
) {
	node.url = rewriteTutorialsLink(node.url, TUTORIAL_MAP, contentType)
}

const getIsRelativeUrl = (url) => {
	try {
		new URL(url)
		return false
	} catch (e) {
		return true
	}
}

export function rewriteTutorialsLink(
	url: string,
	tutorialMap: Record<string, string>,
	contentType: RewriteTutorialLinksPluginOptions['contentType'] = DEFAULT_CONTENT_TYPE
): string {
	let newUrl

	try {
		const urlObject = new URL(url, 'https://learn.hashicorp.com')

		let isExternalLearnLink: boolean
		if (contentType === 'docs' && getIsRelativeUrl(url)) {
			isExternalLearnLink = false
		} else {
			isExternalLearnLink = getIsExternalLearnLink(url)
		}
		const isRewriteableDocsLink = getIsRewriteableDocsLink(url)

		/**
		 * Don't do anything if the link is ambiguous.
		 */
		if (isExternalLearnLink && isRewriteableDocsLink) {
			throw new Error(
				`[rewriteTutorialsLink] Found an ambiguous link: '${url}'`
			)
		}

		/**
		 * Return the url unmodified if it's not rewriteable.
		 */
		if (!isExternalLearnLink && !isRewriteableDocsLink) {
			return url
		}

		/**
		 * Handle the link based on the determined link type.
		 */
		if (isExternalLearnLink) {
			newUrl = rewriteExternalLearnLink(urlObject, tutorialMap)
		} else if (isRewriteableDocsLink) {
			newUrl = rewriteExternalDocsLink(urlObject)
		}

		/**
		 * If the link wasn't found in the map, default to original link. Could be
		 * a typo, it's up to the author to correct -- this feedback should help.
		 */
		if (!newUrl) {
			newUrl = isExternalLearnLink ? urlObject.toString() : url
			throw new Error(
				`[MDX rewriteTutorialsLink]: link could not be rewritten: ${url} \nIf the content at that link is MDX, please check all Learn and Docs .io links in the content to ensure they are correct.`
			)
		}
	} catch (e) {
		// we don't want an incorrect link to break the build
		console.error(e)
	}

	// Return the modified URL, or default to the original one
	return newUrl ?? url
}
