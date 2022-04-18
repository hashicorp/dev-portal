/**
 *  @TODO clean up notes here:
 *
 * If there is a relative path to another tutorial check if the associated product is 'in beta'
 * if it is, rewrite to point internally if not, point it to external learn
 *
 * COLLECTION PATH MAPPING:
 * /collections/{product}/{collection-name} --> /{product}/tutorials/{collection-name}
 *
 * TUTORIAL PATH MAPPING:
 * /tutorials/{product}/{tutorial-name}  --> /{product}/tutorials/{collection-name}/{tutorial-name}
 *
 * Tutorial paths can also have query params to reference collections not in the default context:
 * /tutorials/${product}/{tutorial-name}?in=${product}/${collection-name}
 * --> /{product}/tutorials/{collection-name}/{tutorial-name}
 *
 * And query params with anchor links
 * /tutorials/${product}/{tutorial-name}?in=${product}/${collection-name}#{anchor}
 * --> /{product}/tutorials/{collection-name}/{tutorial-name}#{anchor}
 *
 * And regular anchor links
 * /tutorials/${product}/{tutorial-name}#{anchor} --> /{product}/tutorials/{collection-name}/{tutorial-name}#{anchor}
 *
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
