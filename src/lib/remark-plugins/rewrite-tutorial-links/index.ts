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
	getIsRewriteableLearnLink,
	getTutorialMap,
	handleLearnLink,
	rewriteExternalDocsLink,
} from './utils'

let TUTORIAL_MAP

export const rewriteTutorialLinksPlugin: Plugin = () => {
	return async function transformer(tree) {
		TUTORIAL_MAP = await getTutorialMap()

		visit(tree, 'link', handleRewriteTutorialsLink)
		visit(tree, 'definition', handleRewriteTutorialsLink)
	}
}

function handleRewriteTutorialsLink(node: Link | Definition) {
	node.url = rewriteTutorialsLink(node.url, TUTORIAL_MAP)
}

export function rewriteTutorialsLink(
	url: string,
	tutorialMap: Record<string, string>
): string {
	let newUrl

	try {
		const urlObject = new URL(url, 'https://learn.hashicorp.com')

		const isLearnLink = getIsRewriteableLearnLink(url)
		const isRewriteableDocsLink = getIsRewriteableDocsLink(url)

		/**
		 * Don't do anything if the link is ambiguous.
		 */
		if (
			(isLearnLink === true && isRewriteableDocsLink === true) ||
			(isLearnLink === false && isRewriteableDocsLink === false)
		) {
			throw new Error(
				`[rewriteTutorialsLink] Found an ambiguous link: '${url}'`
			)
		}

		/**
		 * Handle the link based on the determined link type.
		 */
		if (isLearnLink) {
			newUrl = handleLearnLink(urlObject, tutorialMap)
		} else if (isRewriteableDocsLink) {
			newUrl = rewriteExternalDocsLink(urlObject)
		}

		/**
		 * If the link wasn't found in the map, default to original link. Could be
		 * a typo, it's up to the author to correct -- this feedback should help.
		 */
		if (!newUrl) {
			throw new Error(
				`[MDX TUTORIAL]: internal link could not be rewritten: ${url} \nPlease check all Learn links in that tutorial to ensure they are correct.`
			)
		}
	} catch (e) {
		// we don't want an incorrect link to break the build
		console.error(e)
	}

	// Return the modified URL, or default to the original one
	return newUrl || url
}
