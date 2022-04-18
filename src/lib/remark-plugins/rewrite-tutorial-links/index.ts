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
 */

import { Link, Definition } from 'mdast'
import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
//import moize, { Options } from 'moize'
import { ProductOption } from 'lib/learn-client/types'
import {
  getTutorialMap,
  handleCollectionLink,
  handleTutorialLink,
} from './utils'

const learnProducts = new RegExp(Object.keys(ProductOption).join('|'), 'g')
const learnLink = new RegExp('(learn.hashicorp.com|collections|tutorials)')
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
    if (!learnLink.test(node.url)) {
      return
    }

    const [product] = node.url.match(learnProducts)
    const isExternalLearnLink = node.url.includes('learn.hashicorp.com')
    const isBetaProduct = __config.dev_dot.beta_product_slugs.includes(product)

    // if its not a beta product and also not an external link, rewrite
    // external non-beta product links don't need to be rewritten. i.e. learn.hashicorp.com/vault
    if (!isBetaProduct && !isExternalLearnLink) {
      // If its an internal link, rewrite to an external learn link
      node.url = new URL(node.url, 'https://learn.hashicorp.com/').toString()
    }

    if (isBetaProduct) {
      let nodePath = node.url // the path to be formatted - assumes to be absolute as current Learn impl does
      const isCollectionPath = nodePath.includes('collections')
      const isTutorialPath = nodePath.includes('tutorials')

      // if its an external link, isolate the pathname
      if (isExternalLearnLink) {
        const fullUrl = new URL(nodePath)
        nodePath = fullUrl.pathname
      }

      // handle rewriting collection and tutorial dev portal paths
      if (isCollectionPath) {
        node.url = handleCollectionLink(nodePath)
      } else if (isTutorialPath) {
        node.url = handleTutorialLink(nodePath, TUTORIAL_MAP)
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
