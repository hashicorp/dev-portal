/**
 * If there is a relative path to another tutorial
 * check if the associated product is 'in beta'
 * if it is, rewrite to point internally
 *
 * if not, point it to external learn
 *
 * need to handle link references as well
 *
 * decide whether to write as collection or tutorial slug
 *
 * account for ANCHOR LINK basic
 *
 * ANCHOR LINK within a query param --
 *
 * query param
 *
 * /collections/{product}/{collection-name} --> /{product}/tutorials/{collection-name}
 * /tutorials/{product}/{tutorial-name}  --> /{product}/tutorials/{collection-name}/{tutorial-name}
 */

import { Link } from 'mdast'
import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import moize, { Options } from 'moize'
import { ProductOption } from 'lib/learn-client/types'
import path, { isAbsolute } from 'path'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import { getTutorialSlug } from 'views/collection-view/helpers'

const learnProducts = new RegExp(Object.keys(ProductOption).join('|'), 'g')
const learnLink = new RegExp('(learn.hashicorp.com|collections|tutorials)')
const LEARN_URL = 'https://learn.hashicorp.com/'

// @TODO, test efficacy of the memoization with ISR
const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedGenerateTutorialMap = moize(generateTutorialMap, moizeOpts)
let TUTORIAL_MAP = {}

async function generateTutorialMap() {
  console.log('GENERATING MAP') // Going to check the logs to test caching
  const allTutorials = await getAllTutorials({
    fullContent: false,
    slugsOnly: true,
  })

  const mapItems = allTutorials.map((t) => {
    const oldPath = t.slug
    const newPath = getTutorialSlug(t.slug, t.collection_slug)
    return [oldPath, newPath]
  })

  return Object.fromEntries(mapItems)
}

export const rewriteTutorialLinksPlugin: Plugin = () => {
  return async function transformer(tree) {
    TUTORIAL_MAP = await cachedGenerateTutorialMap()

    visit(tree, 'link', (node: Link) => {
      try {
        console.log(node.url, '— ORIGINAL')

        // return early if non tutorial or collection link
        if (!learnLink.test(node.url)) {
          return
        }

        // find product
        const [product] = node.url.match(learnProducts)
        const isBetaProduct =
          __config.dev_dot.beta_product_slugs.includes(product)
        const isExternalLearnLink = node.url.includes('learn.hashicorp.com')

        // if its not a beta product and also not an external link, rewrite
        // external non-beta product links don't need to be rewritten. i.e. learn.hashicorp.com/vault
        if (!isBetaProduct && !isExternalLearnLink) {
          // If its an internal link, rewrite to an external learn link
          node.url = new URL(node.url, LEARN_URL).toString()
        }

        if (isBetaProduct) {
          let nodePath = node.url // the path to be formatted

          // if its an external link, isolate the pathname
          if (isExternalLearnLink) {
            const fullUrl = new URL(nodePath)
            nodePath = fullUrl.pathname
          }

          if (!isAbsolute(nodePath)) {
            // handle path without leading slash i.e. [](tutorials/waypoint/get-started)  - edge case
            nodePath = path.format({ root: '/', base: nodePath })
          }

          const [, contentType, product, filename] = nodePath.split('/') as [
            string, // the leading slash
            'collections' | 'tutorials',
            ProductOption,
            string
          ]

          // handle rewriting collection and tutorial dev portal paths
          if (contentType === 'collections') {
            node.url = `/${product}/tutorials/${filename}`
          } else if (contentType === 'tutorials') {
            node.url = handleTutorialLink(nodePath)
          }

          if (!node.url) {
            throw new Error(
              `[MDX TUTORIAL]: internal link could not be rewritten: ${nodePath}`
            )
          }

          console.log(node.url, '— FINAL')
        }
      } catch (e) {
        console.error(e)
      }
    })
  }
}

function handleTutorialLink(nodePath: string) {
  const hasQueryParam = nodePath.includes('?')
  const hasAnchorLink = nodePath.includes('#')
  let queryParam

  if (hasQueryParam) {
    const [tutorialSlug, query] = nodePath.split('?')
    nodePath = tutorialSlug
    queryParam = query
  }

  const [, , product, filename] = nodePath.split('/') as [
    string, // the leading slash
    'collections' | 'tutorials',
    ProductOption,
    string
  ]

  const tutorialSlug = [product, filename].join('/')
  let finalSlug = TUTORIAL_MAP[tutorialSlug]

  // if there is a query param, the collection name is in provided, so we don't use the map
  if (queryParam) {
    // isolate the collection name from the query
    const [, collectionSlug] = queryParam.split('/')
    finalSlug = `/${product}/tutorials/${collectionSlug}/${filename}`

    // sometimes query params also have an anchor
    if (hasAnchorLink) {
      const [slug, anchor] = collectionSlug.split('#')
      finalSlug = `/${product}/tutorials/${slug}/${filename}#${anchor}`
    }
  } else if (hasAnchorLink) {
    const [isolatedSlug, anchor] = tutorialSlug.split('#')
    finalSlug = TUTORIAL_MAP[isolatedSlug] + `#${anchor}`
  }

  return finalSlug
}
