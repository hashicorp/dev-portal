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
import { ProductOption, SectionOption } from 'lib/learn-client/types'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { productSlugsToHostNames } from 'lib/products'
import {
	getTutorialMap,
	handleCollectionLink,
	handleTutorialLink,
	handleDocsLink,
} from './utils'

let TUTORIAL_MAP

const ACCEPTED_DOCS_PATHNAMES = [
	'docs',
	'api',
	'api-docs',
	'commands',
	'plugins',
	'tools',
	'vagrant-cloud',
	'intro',
	'cdktf',
	'cli',
	'cloud-docs',
	'enterprise',
	'internals',
	'language',
	'plugin',
	'registry',
]
const learnProductOptions = Object.keys(ProductOption).join('|')
const learnSectionOptions = Object.keys(SectionOption).join('|')
/**
 * Matches anything that
 * - contains learn.hashicorp.com
 * - collection & tutorial routes: /collections/waypoint/some-slug or /tutorials/terraform/another-slug
 * - product hub pages i.e. /boundary /waypoint
 * - section routes i.e. /well-architected-framework
 */
const learnLink = new RegExp(
	`(learn.hashicorp.com)|(/(collections|tutorials)/(${learnProductOptions}|cloud|${learnSectionOptions})/)|^/(${learnProductOptions}|cloud)$`
)
const docsLink = new RegExp(
	`(${Object.values(productSlugsToHostNames).join(
		'|'
	)})/(${ACCEPTED_DOCS_PATHNAMES.join('|')})`
)

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
	let newUrl = url

	try {
		// return early if non tutorial or collection link
		if (!learnLink.test(url) && !docsLink.test(url)) {
			return newUrl
		}

		const match: RegExpMatchArray | null = url.match(
			new RegExp(`${learnProductOptions}|cloud|${learnSectionOptions}`)
		)
		const product = match ? match[0] : null
		const isExternalLearnLink = url.includes('learn.hashicorp.com')
		const isBetaProduct = product
			? getIsBetaProduct(product as ProductSlug)
			: false
		const isValidSection = Boolean(SectionOption[product])
		// Anchor links for the current tutorial shouldn't be rewritten. i.e. #some-heading
		const isAnchorLink = url.startsWith('#')

		// if its not a beta product and also not an external link, rewrite
		// external non-beta product links don't need to be rewritten. i.e. learn.hashicorp.com/consul
		if (!isBetaProduct && !isExternalLearnLink && !isAnchorLink) {
			// If its an internal link, rewrite to an external learn link
			newUrl = new URL(url, 'https://learn.hashicorp.com/').toString()
		}

		if (isBetaProduct || isValidSection) {
			let nodePath = url // the path to be formatted - assumes to be absolute as current Learn impl does
			const isCollectionPath = nodePath.includes('collections')
			const isTutorialPath = nodePath.includes('tutorials')
			const learnProductHub = new RegExp(`/${product}$`)
			const isProductHubPath = learnProductHub.test(nodePath)
			const isDocsPath = nodePath.includes(productSlugsToHostNames[product])

			// if its an external link, isolate the pathname
			if (isExternalLearnLink || isDocsPath) {
				const fullUrl = new URL(nodePath)
				// removing the origin from the href instead of only using
				// 'pathname' so that anchor links are included
				nodePath = fullUrl.href.replace(fullUrl.origin, '')
			}

			// handle rewriting collection and tutorial dev portal paths
			if (isDocsPath) {
				newUrl = handleDocsLink(nodePath, product as ProductSlug)
			} else if (isCollectionPath) {
				newUrl = handleCollectionLink(nodePath)
			} else if (isTutorialPath) {
				newUrl = handleTutorialLink(nodePath, tutorialMap)
			} else if (isProductHubPath) {
				newUrl = `${nodePath}/tutorials`
			}

			if (!newUrl) {
				// If the link wasn't found in the map, default to original link
				// Could be a typo, its up to the author to correct -- this feedback should help
				newUrl = nodePath
				throw new Error(
					`[MDX TUTORIAL]: internal link could not be rewritten: ${nodePath} \nPlease check all Learn links in that tutorial to ensure they are correct.`
				)
			}
		}
	} catch (e) {
		console.error(e) // we don't want an incorrect link to break the build
	}

	// Return the modified URL
	return newUrl
}
