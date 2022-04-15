/**
 *  @TODO clean up notes here:
 *  @TODO need to handle link references as well
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

import { Link } from 'mdast'
import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import moize, { Options } from 'moize'
import { ProductOption } from 'lib/learn-client/types'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import { getTutorialSlug } from 'views/collection-view/helpers'

type SplitLearnPath = [
  string, // the leading slash
  'collections' | 'tutorials',
  ProductOption,
  string
]

const learnProducts = new RegExp(Object.keys(ProductOption).join('|'), 'g')
const learnLink = new RegExp('(learn.hashicorp.com|collections|tutorials)')
const LEARN_URL = 'https://learn.hashicorp.com/'

// HELPERS -----------------------------------------------------------------

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

function handleTutorialLink(nodePath: string) {
  const hasQueryParam = nodePath.includes('?')
  const hasAnchorLink = nodePath.includes('#')
  let queryParam

  if (hasQueryParam) {
    const [tutorialSlug, collectionSlug] = nodePath.split('?')
    nodePath = tutorialSlug
    queryParam = collectionSlug
  }

  const [, , product, filename] = nodePath.split('/') as SplitLearnPath

  const tutorialSlug = [product, filename].join('/')
  let finalSlug = TUTORIAL_MAP[tutorialSlug]

  // if there is a query param, the collection name is in provided
  // so we don't use the tutorial map
  if (hasQueryParam) {
    // isolate the collection name from the query
    const [, collectionSlug] = queryParam.split('/')
    finalSlug = `/${product}/tutorials/${collectionSlug}/${filename}`

    // sometimes query params also have an anchor
    if (hasAnchorLink) {
      const [slug, anchor] = collectionSlug.split('#')
      const base = `/${product}/tutorials/${slug}/${filename}`
      finalSlug = [base, anchor].join('#')
    }
  } else if (hasAnchorLink) {
    const [isolatedSlug, anchor] = tutorialSlug.split('#')
    finalSlug = [TUTORIAL_MAP[isolatedSlug], anchor].join('#')
  }

  return finalSlug
}

function handleCollectionLink(nodePath: string) {
  const [, , product, filename] = nodePath.split('/') as SplitLearnPath

  return `/${product}/tutorials/${filename}`
}

// REMARK PLUGIN -------------------------------------------------------

export const rewriteTutorialLinksPlugin: Plugin = () => {
  return async function transformer(tree) {
    TUTORIAL_MAP = await cachedGenerateTutorialMap()

    visit(tree, 'link', (node: Link) => {
      try {
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
            node.url = handleTutorialLink(nodePath)
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
    })
  }
}
