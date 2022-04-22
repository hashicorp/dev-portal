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
import { ProductOption } from 'lib/learn-client/types'
import getIsBetaProduct from 'lib/get-is-beta-product'
import {
  getTutorialMap,
  handleCollectionLink,
  handleTutorialLink,
  handleDocsLink,
  PRODUCT_DOCS_PATHS,
} from './utils'

const learnProductOptions = Object.keys(ProductOption).join('|')
/**
 * Matches anything that
 * - contains learn.hashicorp.com
 * - collection & tutorial routes: /collections/waypoint/some-slug or /tutorials/terraform/another-slug
 * - product hub pages i.e. /boundary /waypoint
 */
const learnLink = new RegExp(
  `(learn.hashicorp.com)|(/(collections|tutorials)/(${learnProductOptions}|cloud)/)|^/(${learnProductOptions}|cloud)$`
)
const docsLink = new RegExp(`(${Object.values(PRODUCT_DOCS_PATHS).join('|')})`) // @TODO tighten this up?

let TUTORIAL_MAP

export const rewriteTutorialLinksPlugin: Plugin = () => {
  return async function transformer(tree) {
    TUTORIAL_MAP = await getTutorialMap()

    visit(tree, 'link', handleRewriteTutorialsLink)
    visit(tree, 'definition', handleRewriteTutorialsLink)
  }
}

function handleRewriteTutorialsLink(node: Link | Definition) {
  try {
    // return early if non tutorial or collection link
    if (!learnLink.test(node.url) && !docsLink) {
      return
    }

    const match = node.url.match(new RegExp(`${learnProductOptions}|cloud`))
    const product = match ? match[0] : null
    const isExternalLearnLink = node.url.includes('learn.hashicorp.com')
    const isBetaProduct = product
      ? getIsBetaProduct(product as ProductSlug)
      : false

    // if its not a beta product and also not an external link, rewrite
    // external non-beta product links don't need to be rewritten. i.e. learn.hashicorp.com/consul
    if (!isBetaProduct && !isExternalLearnLink) {
      // If its an internal link, rewrite to an external learn link
      node.url = new URL(node.url, 'https://learn.hashicorp.com/').toString()
    }

    if (isBetaProduct) {
      let nodePath = node.url // the path to be formatted - assumes to be absolute as current Learn impl does
      const isCollectionPath = nodePath.includes('collections')
      const isTutorialPath = nodePath.includes('tutorials')
      const learnProductHub = new RegExp(`/${product}$`)
      const isProductHubPath = learnProductHub.test(nodePath)
      const isDocsPath = nodePath.includes(PRODUCT_DOCS_PATHS[product])

      // if its an external link, isolate the pathname
      if (isExternalLearnLink || isDocsPath) {
        const fullUrl = new URL(nodePath)
        // removing the origin from the href instead of only using
        // 'pathname' so that anchor links are included
        nodePath = fullUrl.href.replace(fullUrl.origin, '')
      }

      // handle rewriting collection and tutorial dev portal paths
      if (isDocsPath) {
        node.url = handleDocsLink(nodePath, product as ProductSlug)
      } else if (isCollectionPath) {
        node.url = handleCollectionLink(nodePath)
      } else if (isTutorialPath) {
        node.url = handleTutorialLink(nodePath, TUTORIAL_MAP)
      } else if (isProductHubPath) {
        node.url = `${nodePath}/tutorials`
      }

      if (!node.url) {
        // If the link wasn't found in the map, default to original link
        // Could be a typo, its up to the author to correct -- this feedback should help
        node.url = nodePath
        throw new Error(
          `[MDX TUTORIAL]: internal link could not be rewritten: ${nodePath} \nPlease check all Learn links in that tutorial to ensure they are correct.`
        )
      }
    }
  } catch (e) {
    console.error(e) // we don't want an incorrect link to break the build
  }
}
