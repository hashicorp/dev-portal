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
import { ProductSlug } from 'types/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { productSlugsToHostNames } from 'lib/products'
import {
	getIsDocsLink,
	getIsLearnLink,
	getTutorialMap,
	handleCollectionLink,
	handleDocsLink,
	handleTutorialLink,
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

const handleLearnLink = (
	urlObject: URL,
	tutorialMap: Record<string, string>
) => {
	let newUrl

	const { pathname } = urlObject
	const pathnameParts = pathname.split('/')

	let product
	if (pathnameParts.length === 2) {
		product = pathnameParts[1]
	} else if (
		pathnameParts[1] === 'tutorials' ||
		pathnameParts[1] === 'collections'
	) {
		product = pathnameParts[2]
	}

	const isBetaProduct = getIsBetaProduct(product)
	if (isBetaProduct) {
		// Regexes for each path type
		const collectionPathRegex = new RegExp('^/collections')
		const tutorialPathRegex = new RegExp('^/tutorials')
		const productHubPathRegex = new RegExp(`^/${product}/?$`)

		// Derived path type booleans
		const isCollectionPath = collectionPathRegex.test(pathname)
		const isProductHubPath = productHubPathRegex.test(pathname)
		const isTutorialPath = tutorialPathRegex.test(pathname)

		if (isCollectionPath) {
			newUrl = handleCollectionLink(urlObject)
		} else if (isTutorialPath) {
			newUrl = handleTutorialLink(urlObject, tutorialMap)
		} else if (isProductHubPath) {
			newUrl = `/${product}/tutorials`
		}
	} else {
		newUrl = urlObject.toString()
	}

	return newUrl
}

export function rewriteTutorialsLink(
	url: string,
	tutorialMap: Record<string, string>
): string {
	let newUrl = url

	try {
		const urlObject = new URL(url, 'https://learn.hashicorp.com')

		const isLearnLink = getIsLearnLink(url)
		const isDocsLink = getIsDocsLink(url)

		if (isLearnLink) {
			newUrl = handleLearnLink(urlObject, tutorialMap)
		} else if (isDocsLink) {
			const product = Object.keys(productSlugsToHostNames).find(
				(productSlug: ProductSlug) => {
					const productHostName = productSlugsToHostNames[productSlug]
					return urlObject.hostname.includes(productHostName)
				}
			)
			const isBetaProduct = product && getIsBetaProduct(product as ProductSlug)
			if (isBetaProduct) {
				newUrl = handleDocsLink(urlObject, product as ProductSlug)
			}
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
